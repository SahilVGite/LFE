import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

// Simple cosine similarity function for database matching
function cosineSimilarity(str1: string, str2: string): number {
    const words1 = str1.toLowerCase().split(/\s+/)
    const words2 = str2.toLowerCase().split(/\s+/)

    const wordSet = new Set([...words1, ...words2])
    const vec1: number[] = []
    const vec2: number[] = []

    wordSet.forEach((word) => {
        vec1.push(words1.filter((w) => w === word).length)
        vec2.push(words2.filter((w) => w === word).length)
    })

    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0)
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0))
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0))

    if (mag1 === 0 || mag2 === 0) return 0
    return dotProduct / (mag1 * mag2)
}

export async function POST(req: Request) {
    try {
        const { message, sessionId, attachments } = await req.json()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // 1. SESSION CHECK: Check if this message was already answered in this session (Prevents refresh charge)
        const { data: existingMessage } = await supabase
            .from("chat_messages")
            .select("content")
            .eq("session_id", sessionId)
            .eq("role", "user")
            .eq("content", message)
            .single()

        if (existingMessage) {
            // Find the assistant response that followed that user message
            const { data: assistantResponse } = await supabase
                .from("chat_messages")
                .select("content")
                .eq("session_id", sessionId)
                .eq("role", "assistant")
                .order("created_at", { ascending: false })
                .limit(1)
                .single()

            if (assistantResponse) {
                return new Response(assistantResponse.content)
            }
        }

        // 2. Search Database for existing cases (FREE)
        const { data: cases } = await supabase.from("legal_cases").select("*")
        let bestMatch = null
        let bestSimilarity = 0

        if (cases && message) {
            for (const legalCase of cases) {
                const combinedText = `${legalCase.title} ${legalCase.summary} ${legalCase.content}`
                const similarity = cosineSimilarity(message, combinedText)
                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity
                    bestMatch = legalCase
                }
            }
        }

        // 3. Return Database Match if similarity >= 70% (FREE)
        if (bestMatch && bestSimilarity >= 0.7) {
            const dbResponse = `[DATABASE MATCH] This information was found in our records.\n\nTitle: ${bestMatch.title}\nSummary: ${bestMatch.summary}\n\nDisclaimer: This data is retrieved from our database and is free of charge.`

            await supabase.from("chat_messages").insert([
                { user_id: user.id, session_id: sessionId, role: "user", content: message },
                { user_id: user.id, session_id: sessionId, role: "assistant", content: dbResponse }
            ])

            return new Response(dbResponse)
        }

        // 4. CACHE CHECK: Check if the user has paid for this exact question recently elsewhere
        const { data: recentPaidSearch } = await supabase
            .from("search_history")
            .select("*")
            .eq("user_id", user.id)
            .eq("query", message)
            .eq("result_type", "ai_generated")
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        // 5. CREDIT CHECK (Only if not already paid for and not in DB)
        const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single()

        let chargeUser = !recentPaidSearch; // Only charge if no recent paid history exists for this query

        if (chargeUser) {
            if (!profile || profile.credits < 5) {
                return NextResponse.json({ error: "Insufficient credits for AI analysis (5 required)" }, { status: 402 })
            }
            // Deduct credits
            await supabase.from("profiles").update({ credits: profile.credits - 5 }).eq("id", user.id)

            // Log to search history
            await supabase.from("search_history").insert({
                user_id: user.id,
                query: message,
                result_type: "ai_generated",
                credits_used: 5
            })
        }

        // 6. Proceed with Groq AI Streaming
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

        // Save user message first
        await supabase.from("chat_messages").insert([
            { user_id: user.id, session_id: sessionId, role: "user", content: message }
        ])

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are LFE Navigator. NOTE: A charge of 5 credits was applied for this AI analysis because no matching database case was found." },
                { role: "user", content: message }
            ],
            stream: true,
        })

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
            async start(controller) {
                let fullResponse = ""
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content || ""
                    fullResponse += content
                    controller.enqueue(encoder.encode(content))
                }
                await supabase.from("chat_messages").insert({
                    user_id: user.id, session_id: sessionId, role: "assistant", content: fullResponse,
                })
                controller.close()
            },
        })

        return new Response(stream)
    } catch (error) {
        console.error("Chat error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

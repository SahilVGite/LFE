import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { NextResponse } from "next/server"

// Simple cosine similarity function
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

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { query } = await request.json()

        if (!query || typeof query !== "string") {
            return NextResponse.json({ error: "Query is required" }, { status: 400 })
        }

        // Get user profile for current credit balance
        const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single()

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        // --- FIX 1: CACHE CHECK (Prevents deduction on refresh) ---
        // Check if the user has already performed this exact search
        const { data: existingSearch } = await supabase
            .from("search_history")
            .select("*")
            .eq("user_id", user.id)
            .eq("query", query.trim())
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (existingSearch) {
            return NextResponse.json({
                type: existingSearch.result_type,
                case: existingSearch.result_data,
                similarity: existingSearch.result_data?.similarity || 1,
                credits_used: 0, // No charge for repeat search/refresh
                remaining_credits: profile.credits,
            })
        }

        // --- PROCEED WITH NEW SEARCH LOGIC ---

        // Search database for similar cases (Static DB Search - FREE)
        const { data: cases } = await supabase.from("legal_cases").select("*")

        let bestMatch = null
        let bestSimilarity = 0

        if (cases && cases.length > 0) {
            for (const legalCase of cases) {
                const combinedText = `${legalCase.title} ${legalCase.summary} ${legalCase.content} ${legalCase.tags?.join(" ")}`
                const similarity = cosineSimilarity(query, combinedText)

                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity
                    bestMatch = legalCase
                }
            }
        }

        // If similarity >= 70%, return database match (FREE)
        if (bestMatch && bestSimilarity >= 0.7) {
            await supabase.from("search_history").insert({
                user_id: user.id,
                query: query.trim(),
                result_type: "database",
                credits_used: 0,
                result_data: { ...bestMatch, similarity: bestSimilarity },
            })

            return NextResponse.json({
                type: "database",
                case: bestMatch,
                similarity: bestSimilarity,
                credits_used: 0,
                remaining_credits: profile.credits,
            })
        }

        // --- AI GENERATION LOGIC (COST: 5 CREDITS) ---

        if (profile.credits < 5) {
            return NextResponse.json({ error: "Insufficient credits", code: "NOT_ENOUGH_CREDITS" }, { status: 402 })
        }

        // Deduct 5 credits only for new AI generation
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ credits: profile.credits - 5 })
            .eq("id", user.id)

        if (updateError) {
            return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 })
        }

        const prompt = `You are a legal research assistant. Based on the following legal query, generate a comprehensive legal case analysis.

Query: "${query}"

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "A descriptive title for this legal analysis",
  "summary": "A brief 2-3 sentence summary of the legal situation",
  "facts": "Detailed facts of the hypothetical case based on the query",
  "legal_issue": "The main legal issue or question to be addressed",
  "judgment": "The likely legal outcome or judgment based on Indian law",
  "relevant_precedents": ["List of 3-5 relevant Indian legal precedents or landmark cases"],
  "applicable_statutes": ["List of 3-5 applicable Indian laws and statutes"]
}`

        const { text } = await generateText({
            model: "openai/gpt-4o-mini",
            prompt,
            maxOutputTokens: 2000,
        })

        let aiCase
        try {
            let cleanedText = text.trim()
            if (cleanedText.startsWith("```json")) cleanedText = cleanedText.slice(7)
            if (cleanedText.startsWith("```")) cleanedText = cleanedText.slice(3)
            if (cleanedText.endsWith("```")) cleanedText = cleanedText.slice(0, -3)
            aiCase = JSON.parse(cleanedText.trim())
        } catch (parseError) {
            aiCase = {
                title: "Legal Analysis",
                summary: text.substring(0, 200),
                facts: text,
                legal_issue: "See analysis above",
                judgment: "Please consult a legal professional for specific advice",
                relevant_precedents: [],
                applicable_statutes: [],
            }
        }

        // Log search history with AI result
        await supabase.from("search_history").insert({
            user_id: user.id,
            query: query.trim(),
            result_type: "ai_generated",
            credits_used: 5,
            result_data: aiCase,
        })

        return NextResponse.json({
            type: "ai_generated",
            case: aiCase,
            credits_used: 5,
            remaining_credits: profile.credits - 5,
        })
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

/* ---------------------------------------------
   Simple cosine similarity for DB matching
---------------------------------------------- */
function cosineSimilarity(a: string, b: string): number {
  const w1 = a.toLowerCase().split(/\s+/)
  const w2 = b.toLowerCase().split(/\s+/)
  const set = new Set([...w1, ...w2])

  let dot = 0,
    m1 = 0,
    m2 = 0

  for (const word of set) {
    const c1 = w1.filter((x) => x === word).length
    const c2 = w2.filter((x) => x === word).length
    dot += c1 * c2
    m1 += c1 * c1
    m2 += c2 * c2
  }

  return m1 && m2 ? dot / (Math.sqrt(m1) * Math.sqrt(m2)) : 0
}

/* ---------------------------------------------
   POST
---------------------------------------------- */
export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json()
    if (!message || !sessionId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    /* ---------------------------------------------
       Fetch credits early
    ---------------------------------------------- */
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    /* ---------------------------------------------
       1. Duplicate message check (refresh safety)
    ---------------------------------------------- */
    const { data: existingUserMsg } = await supabase
      .from("chat_messages")
      .select("id")
      .eq("session_id", sessionId)
      .eq("role", "user")
      .eq("content", message)
      .limit(1)
      .maybeSingle()

    if (existingUserMsg) {
      const { data: lastAssistant } = await supabase
        .from("chat_messages")
        .select("content")
        .eq("session_id", sessionId)
        .eq("role", "assistant")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastAssistant) {
        return new Response(lastAssistant.content, {
          headers: { "x-credits": String(profile.credits) },
        })
      }
    }

    /* ---------------------------------------------
       2. Database search (FREE)
    ---------------------------------------------- */
    // First, try a simple case-insensitive substring search on title/summary
    const pattern = `%${message}%`
    let bestMatch: any = null
    let bestScore = 0

    try {
      const { data: titleMatches } = await supabase
        .from("legal_cases")
        .select("*")
        .or(`title.ilike.${pattern},summary.ilike.${pattern}`)

      if (titleMatches && titleMatches.length > 0) {
        // Prefer exact/substring title/summary matches (treat as DB match, free)
        bestMatch = titleMatches[0]
        bestScore = 1
      } else {
        // Fallback: brute-force cosine similarity across all cases
        const { data: cases } = await supabase.from("legal_cases").select("*")
        if (cases?.length) {
          for (const c of cases) {
            const score = cosineSimilarity(message, `${c.title} ${c.summary} ${c.content}`)
            if (score > bestScore) {
              bestScore = score
              bestMatch = c
            }
          }
        }
      }
    } catch (e) {
      console.error("DB search error:", e)
    }

    if (bestMatch && bestScore >= 0.7) {
      const tags = Array.isArray(bestMatch.tags) ? bestMatch.tags.join(", ") : bestMatch.tags
      const response = `This information was found in our records.\n\nTitle: ${bestMatch.title}\nCourt: ${bestMatch.court || "N/A"} (${bestMatch.year || "N/A"})\nTags: ${tags || "-"}\n\nSummary:\n${bestMatch.summary}\n\nFull Text:\n${bestMatch.content}\n\nDisclaimer: This data is retrieved from our database and is free of charge.`

      await supabase.from("chat_messages").insert([
        { user_id: user.id, session_id: sessionId, role: "user", content: message },
        {
          user_id: user.id,
          session_id: sessionId,
          role: "assistant",
          content: response,
        },
      ])

      // Log database match to search_history so it appears in the dashboard (free)
      try {
        await supabase.from("search_history").insert({
          user_id: user.id,
          query: message,
          session_id: sessionId,
          result_type: "database",
          credits_used: 0,
          result_data: { ...bestMatch, similarity: bestScore },
        })
      } catch (e) {
        console.error("Failed to log DB match to search_history:", e)
      }

      console.log("DB match returned:", { sessionId, matchId: bestMatch.id, score: bestScore })
      return new Response(response, {
        headers: {
          "x-credits": String(profile.credits),
          "x-db-match": "true",
          "x-best-score": String(bestScore),
        },
      })
    }

    /* ---------------------------------------------
       3. Charge ONLY ONCE per session (AI)
    ---------------------------------------------- */
    const { data: existingCharge } = await supabase
      .from("search_history")
      .select("id")
      .eq("user_id", user.id)
      .eq("session_id", sessionId)
      .eq("result_type", "ai_generated")
      .limit(1)

    let updatedCredits = profile.credits

    if (!existingCharge || existingCharge.length === 0) {
      if (profile.credits < 5) {
        return NextResponse.json(
          { error: "Insufficient credits (5 required)" },
          { status: 402 }
        )
      }

      updatedCredits -= 5

      // Deduct credits
      await supabase
        .from("profiles")
        .update({ credits: updatedCredits })
        .eq("id", user.id)

      // Mark session as charged (unique index protects duplicates)
      await supabase.from("search_history").insert({
        user_id: user.id,
        session_id: sessionId,
        result_type: "ai_generated",
        credits_used: 5,
      })
    }

    // Log when no DB match was good enough so we can tune threshold
    if (!bestMatch || bestScore < 0.7) {
      console.log("No DB match - proceeding to AI", { sessionId, bestMatchId: bestMatch?.id ?? null, bestScore })
    }

    /* ---------------------------------------------
       4. Save user message
    ---------------------------------------------- */
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      session_id: sessionId,
      role: "user",
      content: message,
    })

    /* ---------------------------------------------
       5. Stream AI response
    ---------------------------------------------- */
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are LFE Navigator. If this chat uses AI, credits are charged only once per session.",
        },
        { role: "user", content: message },
      ],
      stream: true,
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        let full = ""
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content || ""
          full += text
          controller.enqueue(encoder.encode(text))
        }

        await supabase.from("chat_messages").insert({
          user_id: user.id,
          session_id: sessionId,
          role: "assistant",
          content: full,
        })

        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "x-credits": String(updatedCredits),
        "x-db-match": "false",
        "x-best-score": String(bestScore),
      },
    })
  } catch (err) {
    console.error("Chat API error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

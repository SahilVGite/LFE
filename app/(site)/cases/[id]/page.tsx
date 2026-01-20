import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { CaseDetail } from "@/components/case-details/CaseDetails"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const supabase = await createClient()
    const { id } = await params

    const { data: currentCase } = await supabase
        .from("legal_cases")
        .select("title, summary")
        .eq("id", id)
        .single()

    return {
        title: currentCase?.title ? `${currentCase.title} | Legal Cases` : "Case Details",
        description: currentCase?.summary || "View detailed legal case information",
    }
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Get user if logged in
    const {
        data: { user },
    } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        profile = data
    }

    // Fetch specific case
    const { data: currentCase, error } = await supabase
        .from("legal_cases")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !currentCase) {
        notFound()
    }

    // Fetch all cases to find previous and next - get FULL case data
    const { data: allCases } = await supabase
        .from("legal_cases")
        .select("*")
        .order("created_at", { ascending: false })

    const currentIndex = allCases?.findIndex((c) => c.id === id) ?? -1

    // Get full case data for previous and next
    let previousCase = null
    let nextCase = null

    if (currentIndex > 0) {
        previousCase = allCases?.[currentIndex - 1]
    }

    if (currentIndex >= 0 && currentIndex < (allCases?.length ?? 0) - 1) {
        nextCase = allCases?.[currentIndex + 1]
    }

    // Fetch related cases (limit to 3, excluding current case)
    const { data: relatedCases } = await supabase
        .from("legal_cases")
        .select("*")
        .neq("id", id)
        .limit(3)

    // Debug logging
    console.log("Current case:", currentCase?.title)
    console.log("Previous case:", previousCase?.title)
    console.log("Next case:", nextCase?.title)
    console.log("Related cases count:", relatedCases?.length)

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={profile} />
            <main className="flex-1">
                <CaseDetail
                    caseData={currentCase}
                    relatedCases={relatedCases || []}
                    previousCase={previousCase || undefined}
                    nextCase={nextCase || undefined}
                />
            </main>
            <Footer />
        </div>
    )
}

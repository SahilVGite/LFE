import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchResults } from "@/components/search/search-results"

export default async function ResultsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams
    const query = params.q

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/auth/login?redirect=/results?q=${encodeURIComponent(query || "")}`)
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) {
        redirect("/auth/login")
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={profile} />
            <main className="flex-1">
                <SearchResults initialQuery={query || ""} userCredits={profile.credits} />
            </main>
            <Footer />
        </div>
    )
}

import { CaseListing } from "@/components/case-listing/CaseListing"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default async function CasesPage() {
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

    const { data: cases } = await supabase
        .from("legal_cases")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={profile} />
            <main className="flex-1">
                <CaseListing cases={cases || []} />
            </main>
            <Footer />
        </div>
    )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()
    if (error || !user) {
        redirect("/auth/login")
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) {
        redirect("/auth/login")
    }

    const { data: searchHistory } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

    const { data: paymentHistory } = await supabase
        .from("payment_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={profile} />
            <main className="flex-1">
                <DashboardContent user={profile} searchHistory={searchHistory || []} paymentHistory={paymentHistory || []} />
            </main>
            <Footer />
        </div>
    )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CasesTable } from "@/components/admin/cases-table"

export default async function AdminCasesPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/admin/login")
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
        redirect("/admin/login")
    }

    const { data: cases } = await supabase.from("legal_cases").select("*").order("created_at", { ascending: false })

    return (
        <div className="p-8">
            <CasesTable cases={cases || []} />
        </div>
    )
}

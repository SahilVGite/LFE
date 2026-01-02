import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CaseForm } from "@/components/admin/case-form"

export default async function AddCasePage() {
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

    return (
        <div className="p-8">
            <div className="max-w-3xl">
                <h1 className="text-3xl font-bold mb-2 text-foreground">Add New Case</h1>
                <p className="text-muted-foreground mb-8">Add a new legal case to the database</p>
                <CaseForm />
            </div>
        </div>
    )
}

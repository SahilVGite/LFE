import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UsersTable } from "@/components/admin/users-table"

export default async function AdminUsersPage() {
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

    const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    return (
        <div className="p-8">
            <UsersTable users={users || []} />
        </div>
    )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PaymentsTable } from "@/components/admin/payments-table"

export default async function AdminPaymentsPage() {
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

    const { data: payments } = await supabase
        .from("payment_history")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false })

    return (
        <div className="p-8">
            <PaymentsTable payments={payments || []} />
        </div>
    )
}

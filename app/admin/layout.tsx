import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Allow access to login page without auth
    if (!user) {
        return <>{children}</>
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // If not admin and not on login page, redirect
    if (profile?.role !== "admin") {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex">
            <AdminSidebar user={profile} />
            <main className="flex-1 ml-64">{children}</main>
        </div>
    )
}

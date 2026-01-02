"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { Scale, LayoutDashboard, FileText, Users, CreditCard, LogOut, Plus } from "lucide-react"

interface AdminSidebarProps {
    user: User
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    const navItems = [
        {
            href: "/admin/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            href: "/admin/cases",
            label: "Legal Cases",
            icon: FileText,
        },
        {
            href: "/admin/users",
            label: "Users",
            icon: Users,
        },
        {
            href: "/admin/payments",
            label: "Payments",
            icon: CreditCard,
        },
    ]

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
            <div className="p-6 border-b border-border">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <Scale className="h-8 w-8 text-primary" />
                    <div>
                        <span className="font-bold text-foreground">LegalCaseAI</span>
                        <span className="block text-xs text-muted-foreground">Admin Panel</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}

                <div className="pt-4">
                    <Button asChild className="w-full" size="sm">
                        <Link href="/admin/cases/add">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Case
                        </Link>
                    </Button>
                </div>
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">{user.email.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </aside>
    )
}

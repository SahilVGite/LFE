import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, CreditCard, Search } from "lucide-react"

export default async function AdminDashboardPage() {
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

    // Get stats
    const { count: casesCount } = await supabase.from("legal_cases").select("*", { count: "exact", head: true })

    const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    const { count: paymentsCount } = await supabase
        .from("payment_history")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")

    const { count: searchesCount } = await supabase.from("search_history").select("*", { count: "exact", head: true })

    // Get recent activity
    const { data: recentSearches } = await supabase
        .from("search_history")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false })
        .limit(5)

    const { data: recentPayments } = await supabase
        .from("payment_history")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false })
        .limit(5)

    const stats = [
        {
            title: "Total Cases",
            value: casesCount || 0,
            icon: FileText,
            description: "Legal cases in database",
        },
        {
            title: "Total Users",
            value: usersCount || 0,
            icon: Users,
            description: "Registered users",
        },
        {
            title: "Completed Payments",
            value: paymentsCount || 0,
            icon: CreditCard,
            description: "Successful transactions",
        },
        {
            title: "Total Searches",
            value: searchesCount || 0,
            icon: Search,
            description: "Case searches performed",
        },
    ]

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of your Legal Case AI platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Recent Searches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentSearches && recentSearches.length > 0 ? (
                            <div className="space-y-4">
                                {recentSearches.map((search: any) => (
                                    <div key={search.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate text-foreground">{search.query}</p>
                                            <p className="text-xs text-muted-foreground">by {search.profiles?.email || "Unknown"}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(search.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No searches yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentPayments && recentPayments.length > 0 ? (
                            <div className="space-y-4">
                                {recentPayments.map((payment: any) => (
                                    <div key={payment.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{payment.credits_purchased} Credits</p>
                                            <p className="text-xs text-muted-foreground">by {payment.profiles?.email || "Unknown"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-foreground">₹{payment.amount_inr}</p>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No payments yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User, SearchHistory, PaymentHistory } from "@/lib/types"
import { Coins, Search, CreditCard, TrendingUp, Clock, FileText } from "lucide-react"
import { formatDate } from "@/lib/date"


interface DashboardContentProps {
    user: User
    searchHistory: SearchHistory[]
    paymentHistory: PaymentHistory[]
}

export function DashboardContent({
    user,
    searchHistory,
    paymentHistory,
}: DashboardContentProps) {
    const totalSearches = searchHistory.length
    const aiSearches = searchHistory.filter(
        (s) => s.result_type === "ai_generated"
    ).length
    const dbSearches = searchHistory.filter(
        (s) => s.result_type === "database"
    ).length

    const totalCreditsUsed = searchHistory.reduce(
        (acc, s) => acc + s.credits_used,
        0
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user.email}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Credits */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Available Credits
                        </CardTitle>
                        <Coins className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user.credits}</div>
                        <Button asChild size="sm" className="mt-2">
                            <Link href="/buy-credits">Buy More</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Searches */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Total Searches
                        </CardTitle>
                        <Search className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSearches}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {dbSearches} database, {aiSearches} AI-generated
                        </p>
                    </CardContent>
                </Card>

                {/* Credits Used */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Credits Used
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCreditsUsed}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            5 credits per AI search
                        </p>
                    </CardContent>
                </Card>

                {/* Account */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Account Type
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">
                            {user.role}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Member since {formatDate(user.created_at)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Search History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Recent Searches
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {searchHistory.length === 0 ? (
                            <div className="text-center py-8">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No searches yet</p>
                                <Button asChild className="mt-4">
                                    <Link href="/">Start Searching</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {searchHistory.map((search) => (
                                    <div
                                        key={search.id}
                                        className="flex items-start justify-between p-4 rounded-lg bg-secondary/50"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium line-clamp-1">
                                                {search.query}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    variant={
                                                        search.result_type === "database"
                                                            ? "secondary"
                                                            : "default"
                                                    }
                                                >
                                                    {search.result_type === "database"
                                                        ? "Database Match"
                                                        : "AI Generated"}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(search.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium">
                                                {search.credits_used > 0
                                                    ? `-${search.credits_used} credits`
                                                    : "Free"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Payment History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {paymentHistory.length === 0 ? (
                            <div className="text-center py-8">
                                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No payments yet</p>
                                <Button asChild className="mt-4">
                                    <Link href="/buy-credits">Buy Credits</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {paymentHistory.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {payment.credits_purchased} Credits
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(payment.created_at)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                ₹{payment.amount_inr}
                                            </p>
                                            <Badge
                                                variant={
                                                    payment.status === "completed"
                                                        ? "default"
                                                        : payment.status === "pending"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {payment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

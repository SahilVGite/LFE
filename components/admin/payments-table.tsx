"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"
import { formatDate } from "@/lib/date"

interface Payment {
    id: string
    user_id: string
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    amount_inr: number
    credits_purchased: number
    status: "pending" | "completed" | "failed"
    created_at: string
    profiles?: { email: string }
}

interface PaymentsTableProps {
    payments: Payment[]
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Payments</h1>
                <p className="text-muted-foreground">View all payment transactions</p>
            </div>

            {payments.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No payments yet</h3>
                    <p className="text-muted-foreground">Payments will appear here once users make purchases.</p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Credits</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.profiles?.email || "Unknown"}</TableCell>
                                    <TableCell>₹{payment.amount_inr}</TableCell>
                                    <TableCell>{payment.credits_purchased}</TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>{formatDate(payment.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

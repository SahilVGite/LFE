"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { Users, Coins } from "lucide-react"
import { formatDate } from "@/lib/date"

interface UsersTableProps {
    users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Users</h1>
                <p className="text-muted-foreground">View and manage registered users</p>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No users yet</h3>
                    <p className="text-muted-foreground">Users will appear here once they sign up.</p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Credits</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Coins className="h-4 w-4 text-primary" />
                                            {user.credits}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

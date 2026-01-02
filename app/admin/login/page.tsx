"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Scale, Shield } from "lucide-react"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) throw authError

            // Check if user is admin
            const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

            if (profile?.role !== "admin") {
                await supabase.auth.signOut()
                throw new Error("Access denied. Admin privileges required.")
            }

            router.push("/admin/dashboard")
            router.refresh()
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                        <Scale className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">LegalCaseAI</span>
                    </Link>

                    <Card className="border-border">
                        <CardHeader className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Admin Login</CardTitle>
                            <CardDescription>Enter your admin credentials to access the panel</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    {error && <p className="text-sm text-destructive">{error}</p>}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Logging in..." : "Login as Admin"}
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    <Link href="/auth/login" className="text-primary underline underline-offset-4">
                                        User Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

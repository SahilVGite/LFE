"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Scale, AlertCircle } from "lucide-react"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const searchParams = useSearchParams()
    const redirect = searchParams.get("redirect")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            console.log("Login attempt for:", email)

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                console.error("Login error:", signInError)

                if (signInError.message.includes("Invalid login credentials")) {
                    throw new Error("Invalid email or password. Please check your credentials and try again.")
                } else if (signInError.message.includes("Email not confirmed")) {
                    throw new Error(
                        "Please verify your email address before logging in. Check your inbox for the confirmation email.",
                    )
                } else if (signInError.message.includes("Email not verified")) {
                    throw new Error(
                        "Your email hasn't been verified yet. Please check your inbox and click the verification link.",
                    )
                } else {
                    throw new Error(signInError.message || "Login failed. Please try again.")
                }
            }

            if (!data.user) {
                throw new Error("Login failed. Please try again.")
            }

            console.log("Login successful for user:", data.user.id)

            const redirectUrl = redirect || "/chat"
            console.log("Redirecting to:", redirectUrl)
            window.location.href = redirectUrl
        } catch (error: unknown) {
            console.error("Login failed:", error)
            setError(error instanceof Error ? error.message : "Failed to login. Please try again.")
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const redirectTo = `${location.origin}/auth/callback`

            console.log("Google OAuth redirect:", redirectTo)

            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo,
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            })

            if (oauthError) {
                console.error("Google OAuth error:", oauthError)
                if (oauthError.message.includes("not enabled")) {
                    throw new Error("Google sign-in is not configured yet. Please contact support or use email/password login.")
                }
                throw new Error("Failed to connect with Google. Please try again.")
            }

            // OAuth will redirect, so this code won't execute
        } catch (error: unknown) {
            console.error("Google login failed:", error)
            setError(error instanceof Error ? error.message : "Failed to login with Google")
            setIsGoogleLoading(false)
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
                        <CardHeader>
                            <CardTitle className="text-2xl text-foreground">Login</CardTitle>
                            <CardDescription>Enter your email below to login to your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full bg-transparent"
                                        onClick={handleGoogleLogin}
                                        disabled={isGoogleLoading || isLoading}
                                    >
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading || isGoogleLoading}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading || isGoogleLoading}
                                        />
                                    </div>
                                    {error && (
                                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                                        {isLoading ? "Logging in..." : "Login"}
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/auth/sign-up" className="text-primary underline underline-offset-4">
                                        Sign up
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}

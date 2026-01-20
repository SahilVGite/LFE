"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = createClient()
                const code = searchParams.get("code")
                const errorCode = searchParams.get("error")
                const errorDescription = searchParams.get("error_description")

                if (errorCode) {
                    throw new Error(errorDescription || "Authentication failed")
                }

                if (code) {
                    // Exchange the code for a session
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                    if (exchangeError) {
                        // Handle case where code was already exchanged due to double-mount
                        if (!exchangeError.message.includes("both 'code' and 'code_verifier'")) {
                            throw exchangeError
                        }
                    }
                }

                // Verify the session was established
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) throw sessionError

                if (session?.user) {
                    const user = session.user

                    // Check if profile exists
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("id")
                        .eq("id", user.id)
                        .maybeSingle()

                    // Create profile if missing
                    if (!profile) {
                        const { error: insertError } = await supabase
                            .from("profiles")
                            .insert({
                                id: user.id,
                                email: user.email,
                                credits: 10,
                                role: "user",
                            })

                        if (insertError && !insertError.message.includes("duplicate key")) {
                            throw insertError
                        }
                    }

                    router.push("/chat")
                    router.refresh()
                } else {
                    router.push("/auth/login")
                }
            } catch (err: any) {
                console.error("Auth callback error:", err)
                setError(err.message || "Authentication failed")

                setTimeout(() => {
                    router.push(`/auth/login?error=${encodeURIComponent(err.message)}`)
                }, 3000)
            }
        }

        handleCallback()
    }, [router, searchParams])

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6">
                <div className="text-center max-w-md bg-destructive/10 border border-destructive/20 rounded-lg p-8">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-destructive">Login Error</h2>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <p className="text-xs animate-pulse">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="mt-4 text-sm font-medium">Finalizing secure login...</p>
            </div>
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <AuthCallback />
        </Suspense>
    )
}

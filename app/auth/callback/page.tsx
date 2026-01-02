"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { AlertCircle } from "lucide-react"

function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = createClient()

                console.log("[v0] Auth callback initiated")

                // Get the code from URL if present (OAuth flow)
                const code = searchParams.get("code")
                const errorCode = searchParams.get("error")
                const errorDescription = searchParams.get("error_description")

                if (errorCode) {
                    console.error("[v0] OAuth error:", errorCode, errorDescription)
                    throw new Error(errorDescription || "Authentication failed")
                }

                if (code) {
                    console.log("[v0] Exchanging code for session")
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                    if (exchangeError) {
                        console.error("[v0] Code exchange error:", exchangeError)
                        throw exchangeError
                    }
                }

                // Get the current session
                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession()

                if (sessionError) {
                    console.error("[v0] Session error:", sessionError)
                    throw sessionError
                }

                if (session?.user) {
                    console.log("[v0] User authenticated:", session.user.id)

                    const { data: profile, error: profileError } = await supabase
                        .from("profiles")
                        .select("id")
                        .eq("id", session.user.id)
                        .maybeSingle()

                    if (profileError) {
                        console.error("[v0] Profile fetch error:", profileError)
                    }

                    // Create profile if it doesn't exist
                    if (!profile) {
                        console.log("[v0] Creating new profile for user:", session.user.id)
                        const { error: insertError } = await supabase
                            .from("profiles")
                            .insert({
                                id: session.user.id,
                                email: session.user.email,
                                credits: 10,
                                role: "user",
                            })
                            .select()
                            .single()

                        if (insertError) {
                            console.error("[v0] Profile creation error:", insertError)
                            // Don't fail if profile already exists
                            if (!insertError.message.includes("duplicate key")) {
                                throw insertError
                            }
                        } else {
                            console.log("[v0] Profile created successfully")
                        }
                    }

                    // Redirect to chat page
                    console.log("[v0] Redirecting to chat")
                    router.push("/chat")
                    router.refresh()
                } else {
                    console.log("[v0] No session found, redirecting to login")
                    router.push("/auth/login")
                }
            } catch (error) {
                console.error("[v0] Auth callback error:", error)
                const errorMessage = error instanceof Error ? error.message : "Authentication failed"
                setError(errorMessage)

                // Redirect to login with error after a delay
                setTimeout(() => {
                    router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`)
                }, 3000)
            }
        }

        handleCallback()
    }, [router, searchParams])

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center max-w-md p-6">
                    <div className="text-red-500 mb-4 flex justify-center">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <p className="text-xs text-muted-foreground">Redirecting to login page...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-sm text-muted-foreground">Completing authentication...</p>
            </div>
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
                    </div>
                </div>
            }
        >
            <AuthCallback />
        </Suspense>
    )
}

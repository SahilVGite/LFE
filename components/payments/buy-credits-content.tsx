"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Check, Sparkles, Shield, Zap, Loader2 } from "lucide-react"
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/razorpay"

declare global {
    interface Window {
        Razorpay: any
    }
}

interface BuyCreditsContentProps {
    currentCredits: number
    userEmail: string
    userName?: string
}

export function BuyCreditsContent({ currentCredits, userEmail, userName }: BuyCreditsContentProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handlePayment = async () => {
        setLoading(true)

        try {
            // Create order on server
            const order = await createRazorpayOrder()

            // Load Razorpay script if not already loaded
            if (!window.Razorpay) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement("script")
                    script.src = "https://checkout.razorpay.com/v1/checkout.js"
                    script.onload = () => resolve()
                    script.onerror = () => reject(new Error("Failed to load Razorpay"))
                    document.body.appendChild(script)
                })
            }

            // Initialize Razorpay checkout
            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Legal Case AI",
                description: "Purchase 100 Credits",
                order_id: order.orderId,
                prefill: {
                    email: userEmail,
                    name: userName || "",
                },
                theme: {
                    color: "#f97316",
                },
                handler: async (response: any) => {
                    // Verify payment on server
                    const result = await verifyRazorpayPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature,
                    )

                    if (result.success) {
                        router.push("/success")
                    } else {
                        router.push("/cancel")
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false)
                    },
                },
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error("Payment error:", error)
            setLoading(false)
        }
    }

    const benefits = [
        "Search database cases for FREE",
        "AI-powered case generation (5 credits each)",
        "Detailed legal analysis",
        "Relevant precedents & statutes",
        "No expiration on credits",
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4 text-primary">
                        <Coins className="h-3 w-3 mr-1" />
                        Credits
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Buy Credits</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Purchase credits to unlock AI-powered legal case generation. Database searches are always free!
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-accent rounded-full px-4 py-2">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                            Current balance: <strong>{currentCredits} credits</strong>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Pricing Card */}
                    <Card className="border-2 border-primary relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                            Best Value
                        </div>
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Credit Package</CardTitle>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-foreground">₹500</span>
                                <span className="text-muted-foreground"> / 100 credits</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ul className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button onClick={handlePayment} disabled={loading} className="w-full" size="lg">
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Coins className="h-4 w-4 mr-2" />
                                        Buy 100 Credits
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">Secure payment powered by Razorpay</p>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <div className="space-y-6">
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    <Zap className="h-5 w-5 text-primary" />
                                    How Credits Work
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 font-bold text-sm">0</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Database Search</p>
                                        <p className="text-sm text-muted-foreground">
                                            Search our legal case database for free. If we find a matching case, no credits are used.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-primary font-bold text-sm">5</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">AI Generation</p>
                                        <p className="text-sm text-muted-foreground">
                                            If no database match is found, we use AI to generate a detailed legal analysis for 5 credits.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Secure & Safe
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        256-bit SSL encryption
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        PCI DSS compliant
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        Credits never expire
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        Instant credit delivery
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

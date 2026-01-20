"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface HeroSectionProps {
    isLoggedIn: boolean
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
    const [query, setQuery] = useState("")
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            const searchParams = new URLSearchParams({ q: query.trim() })
            const targetPath = `/chat?${searchParams.toString()}`
            if (isLoggedIn) {
                router.push(targetPath)
            } else {
                router.push(`/auth/login?redirect=${encodeURIComponent(targetPath)}`)
            }
        }
    }

    const quickPrompts = [
        "Find Legal Help for Dowry",
        "Legal tips for buying property",
        "Get Advice: Inheritance",
        "Brainstorm",
        "Analyze Solution",
    ]

    return (
        <section className="relative py-20 lg:py-28">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background" />

            <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center">
                    <Badge variant="secondary" className="mb-4 text-primary">
                        <Sparkles className="h-3 w-3 mr-1" />
                        World's first legal navigator
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 text-balance">
                        Know your case before you fight it
                    </h1>

                    <p className="text-lg text-muted-foreground font-medium mb-8">
                        Locate relevant cases ∙ Predict case outcome ∙ Get execution strategy
                    </p>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="Ask Legal questions..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-14 pl-5 pr-32 text-lg rounded-full border-2 border-border bg-card shadow-lg focus-visible:ring-secondary"
                            />
                            <Button type="submit" size="lg" className="absolute right-2 rounded-full h-10 px-6">
                                Start Chat
                            </Button>
                        </div>
                    </form>

                    <div className="flex flex-wrap justify-center gap-2">
                        {quickPrompts.map((prompt) => (
                            <Button
                                key={prompt}
                                variant="outline"
                                size="sm"
                                className="rounded-full text-xs bg-transparent"
                                onClick={() => {
                                    const searchParams = new URLSearchParams({ q: prompt })
                                    const targetPath = `/chat?${searchParams.toString()}`
                                    if (isLoggedIn) {
                                        router.push(targetPath)
                                    } else {
                                        router.push(`/auth/login?redirect=${encodeURIComponent(targetPath)}`)
                                    }
                                }}
                            >
                                {prompt}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import {Stars, WhiteArrowUp} from "@/components/svg"

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
        <section className="relative py-10 min-h-screen content-center" style={{ backgroundImage: "url('/banner-bg.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundColor: '#F7F9FB' }}>
            {/* Background decoration */}
            <div className="absolute inset-0" />

            <div className="sub-wrapper mx-auto px-4 relative">
                <div className="max-w-5xl mx-auto text-center">
                    {/* <Badge variant="secondary" className="mb-4 text-primary">
                        <Sparkles className="h-3 w-3 mr-1" />
                        World's first legal navigator
                    </Badge> */}
                    <div className="flex items-center justify-center gap-3.5 bg-white max-w-max mx-auto px-6 py-2 rounded-full mb-6">
                        <Stars />
                        <span className="text-[#333333] bodySub">World’s first legal navigator</span>
                    </div>

                    <h1 className="mb-4 commonTitle">
                        Know your case before you fight it
                    </h1>

                    <p className="bodySub text-[#7B7B7B] tracking-[-0.04em] mb-16">
                        Instant, data-backed clarity on your case timeline, risks, and expected outcomes.
                    </p>

                    <form onSubmit={handleSearch} className="mx-auto mb-6">
                        <label className="relative flex items-center justify-between bodySub whitespace-nowrap pl-5 pr-3 py-10 text-lg rounded-4xl bg-card shadow-lg ">
                            <Input
                                type="text"
                                placeholder="Ask Legal questions"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="subTxt placeholder:text-[#9C9C9C] ring-0 outline-none border-none focus:ring-0 focus-visible:border-none focus-visible:ring-0 bg-transparent shadow-none"
                            />
                            <button className="font-medium font-geist tracking-[-0.04em] text-white flex items-center gap-2 rounded-full py-3 px-4 ml-4 bg-(--btn-bg) shadow-[0px_4.273px_12.819px_-4.273px_#789DF6] hover:brightness-95 transition-all cursor-pointer" type="submit">
                                <span>Check My Case Now</span>
                                <WhiteArrowUp />
                            </button>
                        </label>
                    </form>

                    <div className="flex items-center flex-wrap justify-center gap-2">
                        <span className="subTxt text-primary pr-3">Prompt</span>
                        {quickPrompts.map((prompt) => (
                            <Button
                                key={prompt}
                                variant="outline"
                                size="sm"
                                className="rounded-full text-[#525253] bg-[rgba(255,255,255,0.24)] font-geist txtSub border border-white py-4 px-3 cursor-pointer"
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
                    <div className="mt-10">
                        <Link href="/" className="border border-(--btn-bg) rounded-full text-(--btn-bg) font-medium py-3 px-9 hover:text-white hover:bg-primary hover:font-bold transition-colors">View Plans</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

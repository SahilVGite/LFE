"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Loader2, Database, Sparkles, AlertCircle, Coins, BookOpen, Scale, Calendar } from "lucide-react"
import Link from "next/link"

interface SearchResultsProps {
    initialQuery: string
    userCredits: number
}

interface SearchResult {
    type: "database" | "ai_generated"
    case: any
    similarity?: number
    credits_used: number
}

export function SearchResults({ initialQuery, userCredits }: SearchResultsProps) {
    const [query, setQuery] = useState(initialQuery)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<SearchResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [credits, setCredits] = useState(userCredits)
    const router = useRouter()

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return

        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch("/api/cases/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.code === "NOT_ENOUGH_CREDITS" ? "NOT_ENOUGH_CREDITS" : data.error)
                return
            }

            setResult(data)
            setCredits(data.remaining_credits)
            router.refresh()
        } catch (err) {
            setError("Failed to perform search. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (initialQuery && !result) {
            handleSearch(initialQuery)
        }
    }, [initialQuery])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSearch(query)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Search Form */}
                <Card className="mb-8 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <Search className="h-5 w-5 text-primary" />
                            Legal Case Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex gap-4">
                            <Input
                                type="text"
                                placeholder="Describe your legal case or question..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                    </>
                                )}
                            </Button>
                        </form>
                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                            <Coins className="h-4 w-4" />
                            <span>
                                Your credits: <strong className="text-foreground">{credits}</strong> | Database search:{" "}
                                <strong className="text-green-600">FREE</strong> | AI generation:{" "}
                                <strong className="text-primary">5 credits</strong>
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Error State */}
                {error === "NOT_ENOUGH_CREDITS" && (
                    <Alert variant="destructive" className="mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Insufficient Credits</AlertTitle>
                        <AlertDescription>
                            You need at least 5 credits for AI-powered case generation. Your current balance is {credits} credits.
                            <Button asChild size="sm" className="ml-4">
                                <Link href="/buy-credits">Buy Credits</Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {error && error !== "NOT_ENOUGH_CREDITS" && (
                    <Alert variant="destructive" className="mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Loading State */}
                {isLoading && (
                    <Card className="border-border">
                        <CardContent className="py-12 text-center">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                            <p className="text-muted-foreground">Searching for relevant cases...</p>
                        </CardContent>
                    </Card>
                )}

                {/* Results */}
                {result && !isLoading && (
                    <Card className="border-border">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    {result.type === "database" ? (
                                        <>
                                            <Database className="h-5 w-5 text-green-600" />
                                            Database Match
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            AI Generated Analysis
                                        </>
                                    )}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {result.similarity && <Badge variant="secondary">{Math.round(result.similarity * 100)}% Match</Badge>}
                                    <Badge variant={result.credits_used === 0 ? "secondary" : "default"}>
                                        {result.credits_used === 0 ? "Free Search" : `-${result.credits_used} Credits`}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {result.type === "database" ? (
                                <DatabaseCaseView caseData={result.case} />
                            ) : (
                                <AICaseView caseData={result.case} />
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!result && !isLoading && !error && !initialQuery && (
                    <Card className="border-border">
                        <CardContent className="py-12 text-center">
                            <Scale className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Start Your Legal Research</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Enter a description of your legal case or question above. We&apos;ll search our database for matching
                                cases, or generate an AI analysis if needed.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

function DatabaseCaseView({ caseData }: { caseData: any }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{caseData.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {caseData.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Court:</span>
                    <span className="font-medium text-foreground">{caseData.court}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-medium text-foreground">{caseData.year}</span>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">Summary</h4>
                <p className="text-muted-foreground">{caseData.summary}</p>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">Full Content</h4>
                <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{caseData.content}</p>
                </div>
            </div>
        </div>
    )
}

function AICaseView({ caseData }: { caseData: any }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{caseData.title}</h3>
                <Badge variant="secondary" className="mb-4">
                    AI-Generated Analysis
                </Badge>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">Summary</h4>
                <p className="text-muted-foreground">{caseData.summary}</p>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">Facts of the Case</h4>
                <p className="text-muted-foreground">{caseData.facts}</p>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">Legal Issue</h4>
                <p className="text-muted-foreground">{caseData.legal_issue}</p>
            </div>

            <div>
                <h4 className="font-semibold mb-2 text-foreground">Judgment</h4>
                <p className="text-muted-foreground">{caseData.judgment}</p>
            </div>

            {caseData.relevant_precedents?.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-foreground">Relevant Precedents</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {caseData.relevant_precedents.map((precedent: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">
                                {precedent}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {caseData.applicable_statutes?.length > 0 && (
                <div>
                    <h4 className="font-semibold mb-2 text-foreground">Applicable Statutes</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {caseData.applicable_statutes.map((statute: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">
                                {statute}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

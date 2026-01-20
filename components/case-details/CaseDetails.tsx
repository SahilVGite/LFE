"use client"

import { useRouter } from "next/navigation"
import { Facebook, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { LegalCase } from "@/lib/types"

interface CaseDetailProps {
    caseData: LegalCase
    relatedCases: LegalCase[]
    previousCase?: LegalCase | null
    nextCase?: LegalCase | null
}

export function CaseDetail({ caseData, relatedCases, previousCase, nextCase }: CaseDetailProps) {
    const router = useRouter()

    const handleShare = (platform: string) => {
        const url = typeof window !== "undefined" ? window.location.href : ""
        const title = caseData.title

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        }

        window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }

    const handleCaseClick = (caseId: string) => {
        router.push(`/cases/${caseId}`)
    }

    return (
        <div className="min-h-screen">
            {/* Main Content */}
            <div className="w-full">
                {/* Hero Image - Full Width */}
                <div className="relative w-full h-150 overflow-hidden bg-background">
                    <Image
                        src={"/caseDetailBg.png"}
                        alt={caseData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative w-full overflow-hidden -mt-96">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="mx-auto">
                            <img src={"/case_details.png"} alt={caseData.title} />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 lg:px-8 py-16">
                    <div className="mx-auto">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-[41px] font-medium text-foreground mb-6 leading-tight">
                            {caseData.title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 mb-12">
                            <p className="text-sm text-[#0D0D0D] font-medium">
                                By {caseData.judge || "Unknown"}
                            </p>
                            {caseData.year && (
                                <>
                                    <span className="text-muted-foreground">•</span>
                                    <p className="text-sm text-[#0D0D0D] font-medium">
                                        {caseData.year}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {caseData.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Main Content */}
                        <div className="mb-12">
                            <div className="text-base leading-8 text-foreground/85">
                                {caseData.content ? (
                                    <div className="whitespace-pre-wrap">{caseData.content}</div>
                                ) : (
                                    <p className="text-lg">{caseData.summary}</p>
                                )}
                            </div>
                        </div> 

                        {/* Sharing Section */}
                        <div className="flex items-center gap-6 py-10 border-y border-border/50">
                            <span className="text-sm font-semibold text-foreground">Share:</span>
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-transparent hover:text-primary"
                                    onClick={() => handleShare("facebook")}
                                    title="Share on Facebook"
                                >
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-transparent hover:text-primary"
                                    onClick={() => handleShare("twitter")}
                                    title="Share on Twitter"
                                >
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-transparent hover:text-primary"
                                    onClick={() => handleShare("linkedin")}
                                    title="Share on LinkedIn"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Previous/Next Navigation */}
                        <div className="flex justify-between items-start pt-16">
                            {/* Previous Case */}
                            {previousCase ? (
                                <button
                                    onClick={() => handleCaseClick(previousCase.id)}
                                    className="flex-1 group text-left cursor-pointer hover:no-underline"
                                >
                                    <p className="text-xs text-muted-foreground mb-3 group-hover:text-primary transition-colors">
                                        ← Previous Case
                                    </p>
                                    <p className="text-sm font-semibold text-foreground max-w-xs group-hover:text-primary transition-colors line-clamp-2">
                                        {previousCase.title}
                                    </p>
                                </button>
                            ) : (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-3 opacity-50">← Previous</p>
                                    <p className="text-sm font-semibold text-foreground opacity-50">No previous case</p>
                                </div>
                            )}

                            {/* Next Case */}
                            {nextCase ? (
                                <button
                                    onClick={() => handleCaseClick(nextCase.id)}
                                    className="flex-1 text-right group cursor-pointer hover:no-underline"
                                >
                                    <p className="text-xs text-muted-foreground mb-3 group-hover:text-primary transition-colors">
                                        Next Case →
                                    </p>
                                    <p className="text-sm font-semibold text-foreground max-w-xs ml-auto group-hover:text-primary transition-colors line-clamp-2">
                                        {nextCase.title}
                                    </p>
                                </button>
                            ) : (
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground mb-3 opacity-50">Next →</p>
                                    <p className="text-sm font-semibold text-foreground opacity-50">No next case</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Cases Section */}
            {relatedCases.length > 0 && (
                <div className="border-t border-border/50 bg-background/50">
                    <div className="container mx-auto px-4 py-20">
                        {/* Section Header */}
                        <div className="text-center mb-16 mx-auto">
                            <p className="text-primary text-sm font-semibold tracking-wide mb-3">Related Cases</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">You may also like</h2>
                        </div>

                        {/* Related Cases Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
                            {relatedCases.map((relatedCase) => (
                                <div
                                    key={relatedCase.id}
                                    className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer"
                                    onClick={() => handleCaseClick(relatedCase.id)}
                                >
                                    {/* Tags */}
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {relatedCase.tags?.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs text-muted-foreground bg-accent/8 px-3 py-1 rounded-full border border-accent/20"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-3 text-base leading-snug">
                                        {relatedCase.title}
                                    </h3>

                                    {/* Summary */}
                                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
                                        {relatedCase.summary}
                                    </p>

                                    {/* View Link */}
                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <span className="text-primary text-sm font-medium hover:underline">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import type { LegalCase } from "@/lib/types"

interface CaseListingProps {
    cases: LegalCase[]
}

export function CaseListing({ cases }: CaseListingProps) {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedTag, setSelectedTag] = useState("All")
    const itemsPerPage = 12

    // Get all unique tags
    const allTags = ["All", ...new Set(cases.flatMap((c) => c.tags || []))]

    // Filter cases by selected tag
    const filteredCases =
        selectedTag === "All" ? cases : cases.filter((c) => c.tags?.includes(selectedTag))

    // Paginate
    const totalPages = Math.ceil(filteredCases.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleCardClick = (caseId: string) => {
        router.push(`/cases/${caseId}`)
    }

    return (
        <>
            {/* Header Section */}
            <section className="cases-header-bg border-b border-border py-10 md:py-12 lg:py-25">
                <div className="container mx-auto px-4">
                    <div className="relative">
                        <h1 className="text-2xl md:text-[40px] font-medium text-center mt-6 md:mt-8 lg:mt-12">Reference Cases</h1>
                        <div className="flex items-center gap-2 text-[#1A202C] text-[12px] absolute right-0 top-12 md:top-24 lg:top-28">
                            <button
                                onClick={() => router.push("/")}
                                className="hover:text-foreground transition-colors cursor-pointer"
                            >
                                Home
                            </button>
                            <span>&gt;</span>
                            <span>Reference Cases</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {/* Description */}
                    <div className="mb-12">
                        <h3 className="text-primary font-semibold text-sm mb-2">Cases</h3>
                        <p className="text-xl md:text-2xl text-foreground font-medium max-w-2xl">
                            Explore landmark legal decisions and judicial precedents from across the nation
                        </p>
                    </div>

                    {/* Filter Tags */}
                    <div className="flex flex-wrap gap-2 mb-12">
                        {allTags.map((tag) => (
                            <Button
                                key={tag}
                                variant={selectedTag === tag ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setSelectedTag(tag)
                                    setCurrentPage(1)
                                }}
                                className={
                                    selectedTag === tag
                                        ? ""
                                        : "bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                                }
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>

                    {/* Cases Grid */}
                    {paginatedCases.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {paginatedCases.map((legalCase) => (
                                <div key={legalCase.id} className="h-full">
                                    <Card
                                        className="hover:shadow-lg transition-shadow h-full cursor-pointer group"
                                        onClick={() => handleCardClick(legalCase.id)}
                                    >
                                        <CardContent className="p-6 flex flex-col h-full">
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {legalCase.tags?.slice(0, 3).map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="secondary"
                                                        className="text-xs pointer-events-none"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-foreground mb-3 text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                                {legalCase.title}
                                            </h3>

                                            {/* Summary */}
                                            <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-4">
                                                {legalCase.summary}
                                            </p>

                                            {/* View Details Button */}
                                            <div className="mt-auto pt-4">
                                                <span className="text-primary text-sm font-medium group-hover:underline">
                                                    View Details →
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No cases found for the selected filter.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(Math.max(1, currentPage - 1))
                                        }}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => {
                                    const pageNum = i + 1
                                    // Show all pages if 5 or fewer, otherwise show current and neighbors
                                    const shouldShow =
                                        totalPages <= 5 ||
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        Math.abs(pageNum - currentPage) <= 1

                                    if (!shouldShow && pageNum !== 2 && pageNum !== totalPages - 1) {
                                        return null
                                    }

                                    if (!shouldShow && (pageNum === 2 || pageNum === totalPages - 1)) {
                                        return (
                                            <PaginationItem key={`ellipsis-${pageNum}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )
                                    }

                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                href="#"
                                                isActive={currentPage === pageNum}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handlePageChange(pageNum)
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                }).filter(Boolean)}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(Math.min(totalPages, currentPage + 1))
                                        }}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </section>
        </>
    )
}

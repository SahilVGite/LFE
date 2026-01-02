"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { LegalCase } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface CaseFormProps {
    initialData?: LegalCase
}

export function CaseForm({ initialData }: CaseFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        summary: initialData?.summary || "",
        tags: initialData?.tags?.join(", ") || "",
        court: initialData?.court || "",
        year: initialData?.year?.toString() || new Date().getFullYear().toString(),
        content: initialData?.content || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const supabase = createClient()

        const caseData = {
            title: formData.title,
            summary: formData.summary,
            tags: formData.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            court: formData.court,
            year: Number.parseInt(formData.year),
            content: formData.content,
            updated_at: new Date().toISOString(),
        }

        try {
            if (initialData) {
                const { error } = await supabase.from("legal_cases").update(caseData).eq("id", initialData.id)

                if (error) throw error
            } else {
                const { error } = await supabase.from("legal_cases").insert(caseData)

                if (error) throw error
            }

            router.push("/admin/cases")
            router.refresh()
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-border">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Case Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter case title"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="court">Court</Label>
                            <Input
                                id="court"
                                value={formData.court}
                                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                                placeholder="e.g., Supreme Court of India"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                placeholder="e.g., 2024"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="e.g., property, civil, contract"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea
                            id="summary"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            placeholder="Brief summary of the case"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Full Content</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Full case content, judgment, and details"
                            rows={10}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {initialData ? "Update Case" : "Add Case"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

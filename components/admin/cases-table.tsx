"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { LegalCase } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/date"

interface CasesTableProps {
    cases: LegalCase[]
}

export function CasesTable({ cases }: CasesTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        const supabase = createClient()

        const { error } = await supabase.from("legal_cases").delete().eq("id", deleteId)

        if (!error) {
            router.refresh()
        }

        setIsDeleting(false)
        setDeleteId(null)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Legal Cases</h1>
                    <p className="text-muted-foreground">Manage your legal case database</p>
                </div>
                <Button asChild>
                    <Link href="/admin/cases/add">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Case
                    </Link>
                </Button>
            </div>

            {cases.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No cases yet</h3>
                    <p className="text-muted-foreground mb-4">Start by adding your first legal case to the database.</p>
                    <Button asChild>
                        <Link href="/admin/cases/add">
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Case
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Court</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cases.map((legalCase) => (
                                <TableRow key={legalCase.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate">{legalCase.title}</TableCell>
                                    <TableCell>{legalCase.court}</TableCell>
                                    <TableCell>{legalCase.year}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {legalCase.tags?.slice(0, 2).map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {legalCase.tags?.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{legalCase.tags.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(legalCase.created_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/cases/edit/${legalCase.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => setDeleteId(legalCase.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Case</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this case? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

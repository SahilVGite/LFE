"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, Loader2, X, FileText, ImageIcon, FileIcon } from "lucide-react"
import type { FileAttachment } from "@/lib/types"

interface FileUploadButtonProps {
    onFilesSelected: (files: FileAttachment[]) => void
    disabled?: boolean
    multiple?: boolean
}

export function FileUploadButton({ onFilesSelected, disabled, multiple = true }: FileUploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setUploading(true)
        const uploadedFiles: FileAttachment[] = []

        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append("file", file)

                const response = await fetch("/api/chat/upload", {
                    method: "POST",
                    body: formData,
                })

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}`)
                }

                const data = await response.json()
                uploadedFiles.push(data)
            }

            onFilesSelected(uploadedFiles)
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload some files. Please try again.")
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                multiple={multiple}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                disabled={disabled || uploading}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="h-9 w-9"
            >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            </Button>
        </>
    )
}

interface AttachmentPreviewProps {
    attachment: FileAttachment
    onRemove?: () => void
}

export function AttachmentPreview({ attachment, onRemove }: AttachmentPreviewProps) {
    const isImage = attachment.type.startsWith("image/")
    const isPdf = attachment.type === "application/pdf"

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const getFileIcon = () => {
        if (isImage) return <ImageIcon className="h-4 w-4" />
        if (isPdf) return <FileText className="h-4 w-4" />
        return <FileIcon className="h-4 w-4" />
    }

    return (
        <div className="relative group inline-block">
            {isImage ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                    <img
                        src={attachment.url || "/placeholder.svg"}
                        alt={attachment.filename}
                        className="w-full h-full object-cover"
                    />
                    {onRemove && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={onRemove}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            ) : (
                <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card max-w-[200px]">
                    <div className="shrink-0">{getFileIcon()}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{attachment.filename}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                    </div>
                    {onRemove && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={onRemove}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

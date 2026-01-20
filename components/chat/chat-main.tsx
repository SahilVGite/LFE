"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import type { User, ChatMessage, FileAttachment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Send,
    Volume2,
    Copy,
    RefreshCw,
    Share2,
    Folder,
    Check,
    ThumbsUp,
    ThumbsDown,
    X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { FileUploadButton, AttachmentPreview } from "./file-upload-button"
import { toast } from "sonner"

interface ChatMainProps {
    user: User
    activeSessionId: string | null
    onSessionCreated: (session: any) => void
}

const QUICK_PROMPTS = [
    { icon: "💬", label: "New Chat", action: "new" },
    { icon: "📜", label: "Old Chat History", action: "history" },
    { icon: "❓", label: "Need Help", action: "help" },
]

export function ChatMain({
    user,
    activeSessionId,
    onSessionCreated,
}: ChatMainProps) {
    const searchParams = useSearchParams()
    const initialQueryProcessed = useRef(false)

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [streamingMessage, setStreamingMessage] = useState("")
    const [attachments, setAttachments] = useState<FileAttachment[]>([])
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

    const [isSpeaking, setIsSpeaking] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    /* ---------------------------------------------
       Load messages (string only)
    ---------------------------------------------- */
    const loadMessages = useCallback(async (sessionId: string) => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true })

        if (error) {
            console.error(error)
            return
        }

        setMessages(data ?? [])
    }, [])

    useEffect(() => {
        if (activeSessionId) {
            loadMessages(activeSessionId)
        } else {
            setMessages([])
        }
    }, [activeSessionId, loadMessages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, streamingMessage])

    /* ---------------------------------------------
       Main message handler (FIXED)
    ---------------------------------------------- */
    const processMessage = async (
        messageText: string,
        messageAttachments: FileAttachment[]
    ) => {
        if ((!messageText.trim() && messageAttachments.length === 0) || isLoading)
            return

        setIsLoading(true)
        setStreamingMessage("")

        try {
            const supabase = createClient()
            let finalSessionId: string

            // Create session if needed
            if (!activeSessionId) {
                const { data: newSession, error } = await supabase
                    .from("chat_sessions")
                    .insert({
                        user_id: user.id,
                        title: messageText.slice(0, 50) || "New conversation",
                    })
                    .select()
                    .single()

                if (error || !newSession) throw error

                finalSessionId = newSession.id
                onSessionCreated(newSession)
            } else {
                finalSessionId = activeSessionId
            }

            // Optimistic user message
            const tempUserMessage: ChatMessage = {
                id: `temp-${Date.now()}`,
                user_id: user.id,
                session_id: finalSessionId,
                role: "user",
                content: messageText,
                attachments: messageAttachments,
                created_at: new Date().toISOString(),
            }

            setMessages((prev) => [...prev, tempUserMessage])

            // Send to API
            const response = await fetch("/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    sessionId: finalSessionId,
                    attachments: messageAttachments,
                }),
            })

            if (!response.ok) throw new Error("Failed to send message")

            // Stream response
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (reader) {
                let accumulated = ""
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    accumulated += decoder.decode(value, { stream: true })
                    setStreamingMessage(accumulated)
                }
            }

            // ✅ FIXED: always string
            await loadMessages(finalSessionId)
            setStreamingMessage("")
        } catch (error) {
            console.error(error)
            toast.error("Failed to send message")
        } finally {
            setIsLoading(false)
            setStreamingMessage("")
        }
    }

    /* ---------------------------------------------
       Auto send from home page (?q=)
    ---------------------------------------------- */
    useEffect(() => {
        const query = searchParams.get("q")
        if (query && !activeSessionId && !initialQueryProcessed.current) {
            initialQueryProcessed.current = true
            setTimeout(() => processMessage(query, []), 500)
        }
    }, [searchParams, activeSessionId])

    /* ---------------------------------------------
       UI handlers
    ---------------------------------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const text = input
        const files = [...attachments]
        setInput("")
        setAttachments([])
        await processMessage(text, files)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const handleFilesSelected = (files: FileAttachment[]) => {
        setAttachments((prev) => [...prev, ...files])
    }

    const handleRemoveAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }

    const handleCopyMessage = async (message: ChatMessage) => {
        await navigator.clipboard.writeText(message.content)
        setCopiedMessageId(message.id)
        setTimeout(() => setCopiedMessageId(null), 2000)
        toast.success("Copied")
    }

    const handleRegenerateMessage = async (messageId: string) => {
        const index = messages.findIndex((m) => m.id === messageId)
        if (index <= 0) return

        const userMessage = messages[index - 1]
        if (userMessage.role !== "user") return

        const supabase = createClient()
        await supabase.from("chat_messages").delete().eq("id", messageId)

        await processMessage(userMessage.content, userMessage.attachments || [])
    }

    const handleReadAloud = (message: ChatMessage) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
            return
        }
        const utterance = new SpeechSynthesisUtterance(message.content)

        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        setIsSpeaking(true)
        window.speechSynthesis.speak(utterance)
    }

    const handleShareMessage = async (message: ChatMessage) => {
        if (navigator.share) {
            await navigator.share({ title: "Legal Response", text: message.content })
        }
    }

    /* ---------------------------------------------
       JSX
    ---------------------------------------------- */
    return (
        <div className="flex-1 flex flex-col bg-background">
            {/* Header */}
            {activeSessionId && (
                <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                    <h2 className="text-sm text-muted-foreground">Conversation</h2>
                    <Button variant="ghost" size="icon">
                        <Folder className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-4",
                                message.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {message.role === "assistant" && (
                                <Avatar className="h-8 w-8 bg-orange-500">
                                    <AvatarFallback className="text-white text-xs">
                                        LFE
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={cn(
                                    "rounded-2xl px-4 py-3 max-w-[80%]",
                                    message.role === "user"
                                        ? "bg-muted"
                                        : "bg-card border border-border"
                                )}
                            >
                                <p className="text-sm whitespace-pre-wrap">
                                    {message.content}
                                </p>

                                {message.role === "assistant" && (
                                    <div className="flex gap-1 mt-3 pt-3 border-t border-border/50">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleReadAloud(message)}
                                            className={isSpeaking ? "text-red-500 animate-pulse" : ""}
                                        >
                                            {isSpeaking ? <X className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopyMessage(message)}
                                        >
                                            {copiedMessageId === message.id ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRegenerateMessage(message.id)}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleShareMessage(message)}
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                        <div className="flex-1" />
                                        <ThumbsUp className="h-4 w-4" />
                                        <ThumbsDown className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {streamingMessage && (
                        <div className="flex gap-4">
                            <Avatar className="h-8 w-8 bg-orange-500">
                                <AvatarFallback className="text-white text-xs">
                                    LFE
                                </AvatarFallback>
                            </Avatar>
                            <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-[80%]">
                                <p className="text-sm whitespace-pre-wrap">
                                    {streamingMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-border p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    {attachments.length > 0 && (
                        <div className="mb-3 flex gap-2 flex-wrap">
                            {attachments.map((a, i) => (
                                <AttachmentPreview
                                    key={i}
                                    attachment={a}
                                    onRemove={() => handleRemoveAttachment(i)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="relative">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask legal questions"
                            className="min-h-[60px] pr-24"
                            disabled={isLoading}
                        />
                        <div className="absolute bottom-3 right-3 flex gap-1">
                            <FileUploadButton
                                onFilesSelected={handleFilesSelected}
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={
                                    (!input.trim() && attachments.length === 0) || isLoading
                                }
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

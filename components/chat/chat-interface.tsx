"use client"

import { useState } from "react"
import type { User, ChatSession } from "@/lib/types"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMain } from "./chat-main"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface ChatInterfaceProps {
    user: User
    initialSessions: ChatSession[]
}

export function ChatInterface({ user, initialSessions }: ChatInterfaceProps) {
    const [sessions, setSessions] = useState<ChatSession[]>(initialSessions)
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleNewChat = () => {
        setActiveSessionId(null)
        setSidebarOpen(false)
    }

    const handleSelectSession = (sessionId: string) => {
        setActiveSessionId(sessionId)
        setSidebarOpen(false)
    }

    const handleSessionCreated = (session: ChatSession) => {
        setSessions((prev) => [session, ...prev])
        setActiveSessionId(session.id)
    }

    const handleSessionDeleted = (sessionId: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
        if (activeSessionId === sessionId) {
            setActiveSessionId(null)
        }
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Mobile sidebar toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Sidebar */}
            <ChatSidebar
                user={user}
                sessions={sessions}
                activeSessionId={activeSessionId}
                onNewChat={handleNewChat}
                onSelectSession={handleSelectSession}
                onSessionDeleted={handleSessionDeleted}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main chat area */}
            <ChatMain user={user} activeSessionId={activeSessionId} onSessionCreated={handleSessionCreated} />
        </div>
    )
}

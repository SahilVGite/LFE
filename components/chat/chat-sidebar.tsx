"use client"

import { useState } from "react"
import type { User, ChatSession } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    MessageSquarePlus,
    Search,
    Clock,
    Sparkles,
    X,
    Home,
    Coins,
    LogOut,
    CreditCard,
    LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface ChatSidebarProps {
    user: User
    sessions: ChatSession[]
    activeSessionId: string | null
    onNewChat: () => void
    onSelectSession: (sessionId: string) => void
    onSessionDeleted: (sessionId: string) => void
    isOpen: boolean
    onClose: () => void
}

export function ChatSidebar({
    user,
    sessions,
    activeSessionId,
    onNewChat,
    onSelectSession,
    onSessionDeleted,
    isOpen,
    onClose,
}: ChatSidebarProps) {
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const filteredSessions = sessions.filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()))

    // Group sessions by time
    const today = new Date()
    const todaySessions = filteredSessions.filter((s) => {
        const sessionDate = new Date(s.updated_at)
        return sessionDate.toDateString() === today.toDateString()
    })

    const last7Days = filteredSessions.filter((s) => {
        const sessionDate = new Date(s.updated_at)
        const diffTime = Math.abs(today.getTime() - sessionDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 0 && diffDays <= 7 && sessionDate.toDateString() !== today.toDateString()
    })

    const handleDeleteSession = async (sessionId: string) => {
        const supabase = createClient()
        const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId)

        if (!error) {
            onSessionDeleted(sessionId)
        }
    }

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed md:relative inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-sidebar-border">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/" className="flex items-center gap-2 flex-1">
                            <h1 className="text-lg font-bold text-sidebar-foreground">LFE</h1>
                        </Link>
                        <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={onNewChat}
                        >
                            <MessageSquarePlus className="h-4 w-4 mr-2" />
                            New Chat
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Search Chat
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                            asChild
                        >
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                            asChild
                        >
                            <Link href="/dashboard">
                                <Clock className="h-4 w-4 mr-2" />
                                History
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Chat sessions */}
                <div className="flex-1 overflow-y-auto">
                    {todaySessions.length > 0 && (
                        <div className="p-4">
                            <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">
                                Today
                                <span className="text-sidebar-foreground">{todaySessions.length}</span>
                            </h3>
                            <div className="space-y-1">
                                {todaySessions.map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => onSelectSession(session.id)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                            activeSessionId === session.id
                                                ? "bg-accent text-accent-foreground border-l-2 border-primary"
                                                : "text-sidebar-foreground hover:bg-sidebar-accent",
                                        )}
                                    >
                                        {session.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {last7Days.length > 0 && (
                        <div className="p-4">
                            <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">
                                Previous 7 Days
                                <span className="text-sidebar-foreground">{last7Days.length}</span>
                            </h3>
                            <div className="space-y-1">
                                {last7Days.map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => onSelectSession(session.id)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                            activeSessionId === session.id
                                                ? "bg-accent text-accent-foreground border-l-2 border-primary"
                                                : "text-sidebar-foreground hover:bg-sidebar-accent",
                                        )}
                                    >
                                        {session.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-sidebar-border">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                        <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">Credits</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{user.credits}</span>
                    </div>
                </div>

                {/* Upgrade plan */}
                <div className="px-4 pb-4">
                    <Button
                        variant="outline"
                        className="w-full justify-start border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                        asChild
                    >
                        <Link href="/buy-credits">
                            <Sparkles className="h-4 w-4 mr-2" />
                            <div className="flex-1 text-left">
                                <div className="text-sm font-medium">Upgrade Plan</div>
                                <div className="text-xs text-muted-foreground">Get LFE-8 and more</div>
                            </div>
                        </Link>
                    </Button>
                </div>

                <div className="p-4 border-t border-sidebar-border">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-full flex items-center gap-3 hover:bg-sidebar-accent rounded-lg p-2 transition-colors">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email.split("@")[0]}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{user.email}</p>
                                    <p className="text-xs text-muted-foreground">{user.credits} credits available</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/buy-credits">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Buy Credits
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                <LogOut className="h-4 w-4 mr-2" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Search Dialog */}
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Search Chat</DialogTitle>
                    </DialogHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Legal"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            autoFocus
                        />
                    </div>
                    {searchQuery && (
                        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => {
                                            onSelectSession(session.id)
                                            setSearchOpen(false)
                                            setSearchQuery("")
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-md hover:bg-accent transition-colors border border-border"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-foreground">{session.title}</p>
                                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(session.updated_at), { addSuffix: false })}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">No matching chats found</p>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

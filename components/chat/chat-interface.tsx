"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { User, ChatSession } from "@/lib/types";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMain } from "./chat-main";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface ChatInterfaceProps {
  user: User;
  initialSessions: ChatSession[];
}

export function ChatInterface({ user, initialSessions }: ChatInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* Hydration gate to prevent useId mismatch in ChatSidebar */
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  /* -------------------------------
     USER STATE (IMPORTANT)
  -------------------------------- */
  const [currentUser, setCurrentUser] = useState<User>(user);

  /* -------------------------------
     SESSION STATE
  -------------------------------- */
  const sessionFromUrl = searchParams.get("session");

  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    sessionFromUrl
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* -------------------------------
     Sync session from URL
  -------------------------------- */
  useEffect(() => {
    if (sessionFromUrl) {
      setActiveSessionId(sessionFromUrl);
    }
  }, [sessionFromUrl]);

  /* -------------------------------
     Handlers
  -------------------------------- */
  const handleNewChat = () => {
    setActiveSessionId(null);
    router.push("/chat"); // clears URL session
    setSidebarOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    router.push(`/chat?session=${sessionId}`);
    setSidebarOpen(false);
  };

  const handleSessionCreated = (session: ChatSession) => {
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    router.push(`/chat?session=${session.id}`);
  };

  const handleSessionDeleted = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      router.push("/chat");
    }
  };

  useEffect(() => {
  if (window.innerWidth >= 768) {
    setSidebarOpen(true)
  }
}, [])


  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundImage: "url('/chat-bg.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', }}>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={`fixed top-4 left-4 z-50 bg-white rounded-full hover:bg-[rgba(255,249,234,1)] ${sidebarOpen ? "hidden" : ''}`}
        onClick={() => setSidebarOpen((v) => !v)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-20 w-20" />}
      </Button>

      {/* Sidebar - only render after hydration to prevent useId mismatch */}
      {isHydrated && (
        <ChatSidebar
          user={currentUser}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onSessionDeleted={handleSessionDeleted}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat */}
      <ChatMain
        user={currentUser}
        activeSessionId={activeSessionId}
        onSessionCreated={handleSessionCreated}
        onCreditsUpdate={(credits: number) => setCurrentUser((prev) => ({ ...prev, credits }))}
      />
    </div>
  );
}

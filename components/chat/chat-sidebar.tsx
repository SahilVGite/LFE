"use client";

import { useState, useId } from "react";
import type { User, ChatSession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Trash2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface ChatSidebarProps {
  user: User;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onSessionDeleted: (sessionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const menuId = useId();

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  const daysBetween = (a: Date, b: Date) =>
    Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

  // Group sessions by time
  const now = new Date();

  type SessionGroup = {
    key: string;
    label: string;
    sessions: ChatSession[];
  };

  const groupsMap = new Map<string, SessionGroup>();

  filteredSessions.forEach((session) => {
    const updatedAt = new Date(session.updated_at);
    const diffDays = daysBetween(now, updatedAt);

    // 🟡 Today
    if (isSameDay(now, updatedAt)) {
      const key = "today";
      if (!groupsMap.has(key)) {
        groupsMap.set(key, { key, label: "Today", sessions: [] });
      }
      groupsMap.get(key)!.sessions.push(session);
      return;
    }

    // 🟠 Last 7 Days
    if (diffDays <= 7) {
      const key = "last7";
      if (!groupsMap.has(key)) {
        groupsMap.set(key, { key, label: "Previous 7 Days", sessions: [] });
      }
      groupsMap.get(key)!.sessions.push(session);
      return;
    }

    // 🔵 Month-wise (Older)
    const monthKey = `${updatedAt.getFullYear()}-${updatedAt.getMonth()}`;
    const monthLabel = updatedAt.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });

    if (!groupsMap.has(monthKey)) {
      groupsMap.set(monthKey, {
        key: monthKey,
        label: monthLabel,
        sessions: [],
      });
    }

    groupsMap.get(monthKey)!.sessions.push(session);
  });

  const groupedSessions: SessionGroup[] = Array.from(groupsMap.values());

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDeleteSession = async (sessionId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);

    if (!error) {
      onSessionDeleted(sessionId);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const [todayOpen, setTodayOpen] = useState(true);
  const [last7DaysOpen, setLast7DaysOpen] = useState(true);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed bg-transparent inset-y-0 left-0 z-40 w-72 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="border-b border-sidebar-border">
          <div className="p-4 pb-0 flex items-center gap-2 mb-4">
            <Link href="/" className="flex items-center gap-2 flex-1 bg-white py-2 px-4 tracking-[0.8125em] font-bold rounded-2xl">
              <h1 className="text-lg font-bold text-sidebar-foreground">LFE</h1>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto bg-white rounded-full hover:bg-[rgba(255,249,234,1)]"
              onClick={onClose}
            >
              <X className="h-5 w-5 font-bold" />
            </Button>
          </div>

          {/* Action buttons */}
          <div className="p-4 space-y-2 bg-white rounded-tr-[10px]">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-[rgba(255,249,234,1)]"
              onClick={onNewChat}
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-[rgba(255,249,234,1)]"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Chat
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-[rgba(255,249,234,1)]"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-[rgba(255,249,234,1)]"
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
        <div className="flex-1 overflow-y-auto py-6 px-4 bg-white">
          {groupedSessions.map(({ key, label, sessions }) => {
            if (!sessions.length) return null;

            const isOpen = openGroups[key] ?? true;

            return (
              <div key={key} className="not-first:mt-4">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(key)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground cursor-pointer"
                >
                  <span className="font-bold text-[rgba(40,40,40,1)] text-sm">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[rgba(71,85,105,1)]">
                      {sessions.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform text-[rgba(30,41,59,1)]",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {/* Sessions */}
                {isOpen && (
                  <div className="space-y-1">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => {
                          onSelectSession(session.id);
                          router.push(`/chat?session=${session.id}`);
                          if (window.innerWidth < 1000) {
                            onClose();
                          }
                        }}
                        className={cn(
                          "group flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer first:mt-2",
                          activeSessionId === session.id
                            ? "bg-[rgba(255,249,234,1)] text-accent-foreground border-r-4 border-[rgba(246,144,1,1)]"
                            : "text-sidebar-foreground hover:bg-[rgba(255,249,234,1)]"
                        )}
                      >
                        <span className={`truncate max-w-[90%] ${activeSessionId === session.id ? 'text-[rgba(246,144,1,1)]' : 'text-[rgba(139,139,139,1)]'}`}>
                          {session.title}
                        </span>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="
                            text-muted-foreground hover:text-destructive transition
                            flex md:hidden
                            md:group-hover:flex
                        "
                          aria-label="Delete chat"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border bg-white">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,249,234,1)]">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Credits
              </span>
            </div>
            <span className="text-sm font-bold text-primary">
              {user.credits}
            </span>
          </div>
        </div>

        {/* Upgrade plan */}
        <div className="px-4 pb-4 bg-white">
          <Button
            variant="outline"
            className="w-full justify-start border-(--btn-bg) text-primary hover:bg-[rgba(255,249,234,1)] bg-transparent rounded-4xl p-8 gap-3"
            asChild
          >
            <Link href="/buy-credits" className="">
              {/* <Sparkles className="h-4 w-4 mr-2" /> */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5! h-5!"
              >
                <path
                  d="M18.6563 11.7478L13.98 10.0238L12.2522 5.34375C12.1201 4.98542 11.8813 4.67621 11.568 4.45781C11.2547 4.2394 10.8819 4.12231 10.5 4.12231C10.1181 4.12231 9.74536 4.2394 9.43205 4.45781C9.11875 4.67621 8.87994 4.98542 8.74782 5.34375L7.02375 10.0238L2.34375 11.7478C1.98542 11.8799 1.67621 12.1187 1.45781 12.432C1.23941 12.7454 1.12231 13.1181 1.12231 13.5C1.12231 13.8819 1.23941 14.2546 1.45781 14.568C1.67621 14.8813 1.98542 15.1201 2.34375 15.2522L7.02 16.9762L8.74782 21.6562C8.87994 22.0146 9.11875 22.3238 9.43205 22.5422C9.74536 22.7606 10.1181 22.8777 10.5 22.8777C10.8819 22.8777 11.2547 22.7606 11.568 22.5422C11.8813 22.3238 12.1201 22.0146 12.2522 21.6562L13.9763 16.98L18.6563 15.2522C19.0146 15.1201 19.3238 14.8813 19.5422 14.568C19.7606 14.2546 19.8777 13.8819 19.8777 13.5C19.8777 13.1181 19.7606 12.7454 19.5422 12.432C19.3238 12.1187 19.0146 11.8799 18.6563 11.7478ZM12.7144 15.0441C12.5617 15.1003 12.423 15.1891 12.3079 15.3042C12.1928 15.4192 12.1041 15.5579 12.0478 15.7106L10.5 19.9012L8.95594 15.7106C8.89966 15.5579 8.81092 15.4192 8.69584 15.3042C8.58076 15.1891 8.44208 15.1003 8.28938 15.0441L4.09875 13.5L8.28938 11.9559C8.44208 11.8997 8.58076 11.8109 8.69584 11.6958C8.81092 11.5808 8.89966 11.4421 8.95594 11.2894L10.5 7.09875L12.0441 11.2894C12.1003 11.4421 12.1891 11.5808 12.3042 11.6958C12.4192 11.8109 12.5579 11.8997 12.7106 11.9559L16.9013 13.5L12.7144 15.0441ZM13.125 3.75C13.125 3.45163 13.2435 3.16548 13.4545 2.9545C13.6655 2.74353 13.9516 2.625 14.25 2.625H15.375V1.5C15.375 1.20163 15.4935 0.915483 15.7045 0.704505C15.9155 0.493526 16.2016 0.375 16.5 0.375C16.7984 0.375 17.0845 0.493526 17.2955 0.704505C17.5065 0.915483 17.625 1.20163 17.625 1.5V2.625H18.75C19.0484 2.625 19.3345 2.74353 19.5455 2.9545C19.7565 3.16548 19.875 3.45163 19.875 3.75C19.875 4.04837 19.7565 4.33452 19.5455 4.5455C19.3345 4.75647 19.0484 4.875 18.75 4.875H17.625V6C17.625 6.29837 17.5065 6.58452 17.2955 6.7955C17.0845 7.00647 16.7984 7.125 16.5 7.125C16.2016 7.125 15.9155 7.00647 15.7045 6.7955C15.4935 6.58452 15.375 6.29837 15.375 6V4.875H14.25C13.9516 4.875 13.6655 4.75647 13.4545 4.5455C13.2435 4.33452 13.125 4.04837 13.125 3.75ZM23.625 8.25C23.625 8.54837 23.5065 8.83452 23.2955 9.0455C23.0845 9.25647 22.7984 9.375 22.5 9.375H22.125V9.75C22.125 10.0484 22.0065 10.3345 21.7955 10.5455C21.5845 10.7565 21.2984 10.875 21 10.875C20.7016 10.875 20.4155 10.7565 20.2045 10.5455C19.9935 10.3345 19.875 10.0484 19.875 9.75V9.375H19.5C19.2016 9.375 18.9155 9.25647 18.7045 9.0455C18.4935 8.83452 18.375 8.54837 18.375 8.25C18.375 7.95163 18.4935 7.66548 18.7045 7.4545C18.9155 7.24353 19.2016 7.125 19.5 7.125H19.875V6.75C19.875 6.45163 19.9935 6.16548 20.2045 5.9545C20.4155 5.74353 20.7016 5.625 21 5.625C21.2984 5.625 21.5845 5.74353 21.7955 5.9545C22.0065 6.16548 22.125 6.45163 22.125 6.75V7.125H22.5C22.7984 7.125 23.0845 7.24353 23.2955 7.4545C23.5065 7.66548 23.625 7.95163 23.625 8.25Z"
                  fill="#FFCC40"
                />
              </svg>
              <div className="flex-1 text-left">
                <div className="text-sm font-bold text-black">Upgrade Plan</div>
                <div className="text-xs text-muted-foreground">
                  Get LFE-8 and more
                </div>
              </div>
            </Link>
          </Button>
        </div>

        <div className="p-4 border-t border-sidebar-border bg-white">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                id={menuId}
                aria-controls={`${menuId}-content`}
                className="w-full flex items-center gap-3 hover:bg-[rgba(255,249,234,1)] rounded-lg p-2 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-sidebar-foreground truncate">
                    {user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              id={`${menuId}-content`}
              align="end"
              className="w-56"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.credits} credits available
                  </p>
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
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
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
                      onSelectSession(session.id);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-4 py-3 rounded-md hover:bg-accent transition-colors border border-border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(session.updated_at), {
                          addSuffix: false,
                        })}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No matching chats found
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { User, ChatMessage, FileAttachment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Search,
  X,
  SendHorizonal,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { FileUploadButton, AttachmentPreview } from "./file-upload-button";
import { toast } from "sonner";

interface ChatMainProps {
  user: User;
  activeSessionId: string | null;
  onSessionCreated: (session: any) => void;
  onCreditsUpdate?: (credits: number) => void;
  isOpen: boolean;
}

const QUICK_PROMPTS = [
  { icon: "💬", label: "New Chat", action: "new" },
  { icon: "📜", label: "Old Chat History", action: "history" },
  { icon: "❓", label: "Need Help", action: "help" },
];

export function ChatMain({
  user,
  activeSessionId,
  onSessionCreated,
  onCreditsUpdate,
  isOpen,
}: ChatMainProps) {
  const searchParams = useSearchParams();
  const initialQueryProcessed = useRef(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sessionIdFromUrl = searchParams.get("session");

  // show messages only when session exists
    const shouldShowMessages = Boolean(sessionIdFromUrl);

  /* ---------------------------------------------
       Load messages (string only)
    ---------------------------------------------- */
  const loadMessages = useCallback(async (sessionId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setMessages(data ?? []);
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      loadMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  /* ---------------------------------------------
       Main message handler (FIXED)
    ---------------------------------------------- */
  const processMessage = async (
    messageText: string,
    messageAttachments: FileAttachment[]
  ) => {
    if ((!messageText.trim() && messageAttachments.length === 0) || isLoading)
      return;

    setIsLoading(true);
    setStreamingMessage("");

    try {
      const supabase = createClient();
      let finalSessionId: string;

      // Create session if needed
      if (!activeSessionId) {
        const { data: newSession, error } = await supabase
          .from("chat_sessions")
          .insert({
            user_id: user.id,
            title: messageText.slice(0, 50) || "New conversation",
          })
          .select()
          .single();

        if (error || !newSession) throw error;

        finalSessionId = newSession.id;
        onSessionCreated(newSession);
      } else {
        finalSessionId = activeSessionId;
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
      };

      setMessages((prev) => [...prev, tempUserMessage]);

      // Send to API
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionId: finalSessionId,
          attachments: messageAttachments,
        }),
      });

      // Update client-side credits immediately if header provided
      try {
        const creditsHeader = response.headers.get("x-credits");
        if (creditsHeader && typeof onCreditsUpdate === "function") {
          const parsed = parseInt(creditsHeader, 10);
          if (!isNaN(parsed)) onCreditsUpdate(parsed);
        }
      } catch (e) {
        // ignore
      }

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Failed to send message";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }
      // Stream response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setStreamingMessage(accumulated);
        }
      }

      // ✅ FIXED: always string
      await loadMessages(finalSessionId);
      setStreamingMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  /* ---------------------------------------------
       Auto send from home page (?q=)
    ---------------------------------------------- */
  useEffect(() => {
    const query = searchParams.get("q");
    if (query && !activeSessionId && !initialQueryProcessed.current) {
      initialQueryProcessed.current = true;
      setTimeout(() => processMessage(query, []), 500);
    }
  }, [searchParams, activeSessionId]);

  /* ---------------------------------------------
       UI handlers
    ---------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input;
    const files = [...attachments];
    setInput("");
    setAttachments([]);
    await processMessage(text, files);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFilesSelected = (files: FileAttachment[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyMessage = async (message: ChatMessage) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedMessageId(message.id);
    setTimeout(() => setCopiedMessageId(null), 2000);
    toast.success("Copied");
  };

  const handleRegenerateMessage = async (messageId: string) => {
    const index = messages.findIndex((m) => m.id === messageId);
    if (index <= 0) return;

    const userMessage = messages[index - 1];
    if (userMessage.role !== "user") return;

    const supabase = createClient();
    await supabase.from("chat_messages").delete().eq("id", messageId);

    await processMessage(userMessage.content, userMessage.attachments || []);
  };

  const handleReadAloud = (message: ChatMessage) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(message.content);

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShareMessage = async (message: ChatMessage) => {
    if (navigator.share) {
      await navigator.share({ title: "Legal Response", text: message.content });
    }
  };

  const formatMessageTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const time = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return time; // 02:22 AM
    }

    const dayMonth = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    return `${time} \u00A0 ${dayMonth}`; // 02:22 AM 16 Dec
  };

  /* ---------------------------------------------
       JSX
    ---------------------------------------------- */
  return (
    <div className={`flex-1 flex flex-col transition-all ${!shouldShowMessages && 'justify-center'} ${isOpen ? "[@media(max-width:768px)]:w-full [@media(max-width:950px)]:max-w-[62%] [@media(max-width:1600px)]:max-w-[70%] [@media(min-width:1800px)]:max-w-[85%] ml-auto" : "max-w-full"}`}>
      {/* Header */}
      {/* {activeSessionId && (
                <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                    <h2 className="text-sm text-muted-foreground">Conversation</h2>
                    <Button variant="ghost" size="icon">
                        <Folder className="h-4 w-4" />
                    </Button>
                </div>
            )} */}

      {/* Messages */}
      {shouldShowMessages && (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
            {messages.map((message) => (
                <div
                key={message.id}
                className={cn(
                    "flex gap-4",
                    message.role === "user" ? "justify-end items-center" : "justify-start items-start"
                )}
                >
                {message.role === "assistant" && (
                    // <Avatar className="h-8 w-8 bg-orange-500">
                    //     <AvatarFallback className="text-white text-xs">
                    //         LFE
                    //     </AvatarFallback>
                    // </Avatar>
                    <div className="rounded-full bg-white w-auto h-auto p-2.5">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M17.0625 9.625H10.9375C10.5894 9.625 10.2556 9.76328 10.0094 10.0094C9.76328 10.2556 9.625 10.5894 9.625 10.9375V17.0625C9.625 17.4106 9.76328 17.7444 10.0094 17.9906C10.2556 18.2367 10.5894 18.375 10.9375 18.375H17.0625C17.4106 18.375 17.7444 18.2367 17.9906 17.9906C18.2367 17.7444 18.375 17.4106 18.375 17.0625V10.9375C18.375 10.5894 18.2367 10.2556 17.9906 10.0094C17.7444 9.76328 17.4106 9.625 17.0625 9.625ZM15.75 15.75H12.25V12.25H15.75V15.75ZM25.375 15.3125H24.0625V12.6875H25.375C25.7231 12.6875 26.0569 12.5492 26.3031 12.3031C26.5492 12.0569 26.6875 11.7231 26.6875 11.375C26.6875 11.0269 26.5492 10.6931 26.3031 10.4469C26.0569 10.2008 25.7231 10.0625 25.375 10.0625H24.0625V6.125C24.0625 5.54484 23.832 4.98844 23.4218 4.5782C23.0116 4.16797 22.4552 3.9375 21.875 3.9375H17.9375V2.625C17.9375 2.2769 17.7992 1.94306 17.5531 1.69692C17.3069 1.45078 16.9731 1.3125 16.625 1.3125C16.2769 1.3125 15.9431 1.45078 15.6969 1.69692C15.4508 1.94306 15.3125 2.2769 15.3125 2.625V3.9375H12.6875V2.625C12.6875 2.2769 12.5492 1.94306 12.3031 1.69692C12.0569 1.45078 11.7231 1.3125 11.375 1.3125C11.0269 1.3125 10.6931 1.45078 10.4469 1.69692C10.2008 1.94306 10.0625 2.2769 10.0625 2.625V3.9375H6.125C5.54484 3.9375 4.98844 4.16797 4.5782 4.5782C4.16797 4.98844 3.9375 5.54484 3.9375 6.125V10.0625H2.625C2.2769 10.0625 1.94306 10.2008 1.69692 10.4469C1.45078 10.6931 1.3125 11.0269 1.3125 11.375C1.3125 11.7231 1.45078 12.0569 1.69692 12.3031C1.94306 12.5492 2.2769 12.6875 2.625 12.6875H3.9375V15.3125H2.625C2.2769 15.3125 1.94306 15.4508 1.69692 15.6969C1.45078 15.9431 1.3125 16.2769 1.3125 16.625C1.3125 16.9731 1.45078 17.3069 1.69692 17.5531C1.94306 17.7992 2.2769 17.9375 2.625 17.9375H3.9375V21.875C3.9375 22.4552 4.16797 23.0116 4.5782 23.4218C4.98844 23.832 5.54484 24.0625 6.125 24.0625H10.0625V25.375C10.0625 25.7231 10.2008 26.0569 10.4469 26.3031C10.6931 26.5492 11.0269 26.6875 11.375 26.6875C11.7231 26.6875 12.0569 26.5492 12.3031 26.3031C12.5492 26.0569 12.6875 25.7231 12.6875 25.375V24.0625H15.3125V25.375C15.3125 25.7231 15.4508 26.0569 15.6969 26.3031C15.9431 26.5492 16.2769 26.6875 16.625 26.6875C16.9731 26.6875 17.3069 26.5492 17.5531 26.3031C17.7992 26.0569 17.9375 25.7231 17.9375 25.375V24.0625H21.875C22.4552 24.0625 23.0116 23.832 23.4218 23.4218C23.832 23.0116 24.0625 22.4552 24.0625 21.875V17.9375H25.375C25.7231 17.9375 26.0569 17.7992 26.3031 17.5531C26.5492 17.3069 26.6875 16.9731 26.6875 16.625C26.6875 16.2769 26.5492 15.9431 26.3031 15.6969C26.0569 15.4508 25.7231 15.3125 25.375 15.3125ZM21.4375 21.4375H6.5625V6.5625H21.4375V21.4375Z"
                        fill="url(#paint0_linear_465_331)"
                        />
                        <defs>
                        <linearGradient
                            id="paint0_linear_465_331"
                            x1="14"
                            y1="1.3125"
                            x2="14"
                            y2="26.6875"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#F6B501" />
                            <stop offset="1" stopColor="#FF7948" />
                        </linearGradient>
                        </defs>
                    </svg>
                    </div>
                )}

                <div className="max-w-[80%]">
                    <div
                    className={`flex items-center gap-2 mb-2 ${
                        message.role === "user" && "justify-end"
                    }`}
                    >
                    {message.role === "assistant" ? (
                        <p className="text-sm font-bold">LFE Navigator</p>
                    ) : (
                        <p className="text-sm font-bold">You</p>
                    )}
                    <span className="text-xs font-medium text-[rgba(148,163,184,1)]">
                        {formatMessageTime(message.created_at)}
                    </span>
                    </div>
                    <div
                    className={`rounded-3xl ${
                        message.role === "user" ? "px-6 py-3" : "p-6"
                    } bg-card`}
                    >
                    <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                    </p>
                    </div>

                    {message.role === "assistant" && (
                    <div className="flex gap-1 mt-3 pt-3 border-t border-border/50">
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReadAloud(message)}
                        className={isSpeaking ? "text-red-500 animate-pulse" : "cursor-pointer"}
                        >
                        {isSpeaking ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyMessage(message)}
                        className="cursor-pointer"
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
                        className="cursor-pointer"
                        >
                        <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShareMessage(message)}
                        className="cursor-pointer"
                        >
                        <Share2 className="h-4 w-4" />
                        </Button>
                        <div className="flex-1" />
                        <ThumbsUp className="h-4 w-4" />
                        <ThumbsDown className="h-4 w-4" />
                    </div>
                    )}
                </div>

                {message.role === 'user' && (
                    <div className="flex items-center gap-3 hover:bg-sidebar-accent rounded-lg p-2 transition-colors h-10 w-10">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
                </div>
            ))}

            {streamingMessage && (
                <div className="flex gap-4">
                <Avatar className="h-8 w-8 bg-orange-500">
                    <AvatarFallback className="text-xs">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M17.0625 9.625H10.9375C10.5894 9.625 10.2556 9.76328 10.0094 10.0094C9.76328 10.2556 9.625 10.5894 9.625 10.9375V17.0625C9.625 17.4106 9.76328 17.7444 10.0094 17.9906C10.2556 18.2367 10.5894 18.375 10.9375 18.375H17.0625C17.4106 18.375 17.7444 18.2367 17.9906 17.9906C18.2367 17.7444 18.375 17.4106 18.375 17.0625V10.9375C18.375 10.5894 18.2367 10.2556 17.9906 10.0094C17.7444 9.76328 17.4106 9.625 17.0625 9.625ZM15.75 15.75H12.25V12.25H15.75V15.75ZM25.375 15.3125H24.0625V12.6875H25.375C25.7231 12.6875 26.0569 12.5492 26.3031 12.3031C26.5492 12.0569 26.6875 11.7231 26.6875 11.375C26.6875 11.0269 26.5492 10.6931 26.3031 10.4469C26.0569 10.2008 25.7231 10.0625 25.375 10.0625H24.0625V6.125C24.0625 5.54484 23.832 4.98844 23.4218 4.5782C23.0116 4.16797 22.4552 3.9375 21.875 3.9375H17.9375V2.625C17.9375 2.2769 17.7992 1.94306 17.5531 1.69692C17.3069 1.45078 16.9731 1.3125 16.625 1.3125C16.2769 1.3125 15.9431 1.45078 15.6969 1.69692C15.4508 1.94306 15.3125 2.2769 15.3125 2.625V3.9375H12.6875V2.625C12.6875 2.2769 12.5492 1.94306 12.3031 1.69692C12.0569 1.45078 11.7231 1.3125 11.375 1.3125C11.0269 1.3125 10.6931 1.45078 10.4469 1.69692C10.2008 1.94306 10.0625 2.2769 10.0625 2.625V3.9375H6.125C5.54484 3.9375 4.98844 4.16797 4.5782 4.5782C4.16797 4.98844 3.9375 5.54484 3.9375 6.125V10.0625H2.625C2.2769 10.0625 1.94306 10.2008 1.69692 10.4469C1.45078 10.6931 1.3125 11.0269 1.3125 11.375C1.3125 11.7231 1.45078 12.0569 1.69692 12.3031C1.94306 12.5492 2.2769 12.6875 2.625 12.6875H3.9375V15.3125H2.625C2.2769 15.3125 1.94306 15.4508 1.69692 15.6969C1.45078 15.9431 1.3125 16.2769 1.3125 16.625C1.3125 16.9731 1.45078 17.3069 1.69692 17.5531C1.94306 17.7992 2.2769 17.9375 2.625 17.9375H3.9375V21.875C3.9375 22.4552 4.16797 23.0116 4.5782 23.4218C4.98844 23.832 5.54484 24.0625 6.125 24.0625H10.0625V25.375C10.0625 25.7231 10.2008 26.0569 10.4469 26.3031C10.6931 26.5492 11.0269 26.6875 11.375 26.6875C11.7231 26.6875 12.0569 26.5492 12.3031 26.3031C12.5492 26.0569 12.6875 25.7231 12.6875 25.375V24.0625H15.3125V25.375C15.3125 25.7231 15.4508 26.0569 15.6969 26.3031C15.9431 26.5492 16.2769 26.6875 16.625 26.6875C16.9731 26.6875 17.3069 26.5492 17.5531 26.3031C17.7992 26.0569 17.9375 25.7231 17.9375 25.375V24.0625H21.875C22.4552 24.0625 23.0116 23.832 23.4218 23.4218C23.832 23.0116 24.0625 22.4552 24.0625 21.875V17.9375H25.375C25.7231 17.9375 26.0569 17.7992 26.3031 17.5531C26.5492 17.3069 26.6875 16.9731 26.6875 16.625C26.6875 16.2769 26.5492 15.9431 26.3031 15.6969C26.0569 15.4508 25.7231 15.3125 25.375 15.3125ZM21.4375 21.4375H6.5625V6.5625H21.4375V21.4375Z"
                        fill="url(#paint0_linear_465_331)"
                        />
                        <defs>
                        <linearGradient
                            id="paint0_linear_465_331"
                            x1="14"
                            y1="1.3125"
                            x2="14"
                            y2="26.6875"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#F6B501" />
                            <stop offset="1" stopColor="#FF7948" />
                        </linearGradient>
                        </defs>
                    </svg>
                    </AvatarFallback>
                </Avatar>
                <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-[80%]">
                    <p>LFE Navigator</p>
                    <p className="text-sm whitespace-pre-wrap">
                    {streamingMessage}
                    </p>
                </div>
                </div>
            )}

            <div ref={messagesEndRef} />
            </div>
        </div>
      )}

      {/* Input */}
      <div className={`border-t border-border p-6 ${!shouldShowMessages && 'border-none'}`}>
        {!shouldShowMessages && (
            <p className="text-center mb-3 lg:mb-8 font-medium commonTitle">Let’s Begin</p>
        )}
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

          <div className="relative flex items-center gap-5">
            <label className="w-full bg-white shadow-lg rounded-4xl overflow-hidden pl-10 pr-3 py-5 lg:py-10 subBody">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask legal questions"
                className="placeholder:text-[#9C9C9C] ring-0 outline-none border-none focus:ring-0 focus-visible:border-none focus-visible:ring-0 bg-transparent shadow-none"
                disabled={isLoading}
              />
              <div className="absolute bottom-1/2 translate-y-1/2 left-5">
                <Search className="h-5 w-5" />
              </div>
            </label>
            <div className="flex gap-1">
              {/* <FileUploadButton
                onFilesSelected={handleFilesSelected}
                disabled={isLoading}
              /> */}

              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-(--btn-bg) shadow-[0px_4.273px_12.819px_-4.273px_#789DF6] p-6 lg:p-8 cursor-pointer"
                disabled={
                  (!input.trim() && attachments.length === 0) || isLoading
                }
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

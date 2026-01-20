export interface User {
    id: string
    email: string
    role: "user" | "admin"
    credits: number
    created_at: string
    updated_at: string
}

export interface LegalCase {
    id: string
    title: string
    summary: string
    content?: string
    court: string
    year: number
    judge?: string
    tags?: string[]
    image_url?: string
    created_at: string
    updated_at: string
}

export interface SearchHistory {
    id: string
    user_id: string
    query: string
    result_type: "database" | "ai_generated"
    credits_used: number
    result_data: any
    created_at: string
}

export interface PaymentHistory {
    id: string
    user_id: string
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    amount_inr: number
    credits_purchased: number
    status: "pending" | "completed" | "failed"
    created_at: string
}

export interface SearchResult {
    type: "database" | "ai_generated"
    case: LegalCase | AIGeneratedCase
    similarity?: number
    credits_used: number
}

export interface AIGeneratedCase {
    title: string
    summary: string
    facts: string
    legal_issue: string
    judgment: string
    relevant_precedents: string[]
    applicable_statutes: string[]
}

export interface ChatSession {
    id: string
    user_id: string
    title: string
    created_at: string
    updated_at: string
}

export interface FileAttachment {
    url: string
    filename: string
    size: number
    type: string
}

export interface ChatMessage {
    id: string
    user_id: string
    session_id: string | null
    role: "user" | "assistant" | "system"
    content: string
    attachments?: FileAttachment[]
    created_at: string
}

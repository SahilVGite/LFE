import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        // Validate file size (max 50MB)
        const maxSize = 50 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 })
        }

        // Upload to Vercel Blob with user-specific path
        const blob = await put(`chat-files/${user.id}/${Date.now()}-${file.name}`, file, {
            access: "public",
        })

        return NextResponse.json({
            url: blob.url,
            filename: file.name,
            size: file.size,
            type: file.type,
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}

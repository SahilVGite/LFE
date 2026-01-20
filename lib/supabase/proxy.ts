import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // 1. Update request cookies for the current execution
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

                    // 2. Refresh the response object to include new cookies
                    supabaseResponse = NextResponse.next({ request })

                    // 3. Set cookies on the final response for the browser
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        },
    )

    // IMPORTANT: getUser() triggers the refresh logic if the session is expired
    const { data: { user } } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const protectedRoutes = ["/dashboard", "/buy-credits", "/results", "/success", "/cancel", "/chat"]
    const isUserProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
    const isAdminPath = path.startsWith("/admin")
    const isAdminLogin = path === "/admin/login"

    // Redirect logic: Protected User Routes
    if (isUserProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = "/auth/login"
        url.searchParams.set("redirect", path)
        return NextResponse.redirect(url)
    }

    // Redirect logic: Protected Admin Routes
    if (isAdminPath && !isAdminLogin) {
        if (!user) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profile?.role !== "admin") {
            return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url))
        }
    }

    return supabaseResponse
}

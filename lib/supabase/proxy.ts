import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // With Fluid compute, don't put this client in a global environment
    // variable. Always create a new one on each request.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
                },
            },
        },
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: If you remove getUser() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Normal protected routes
    const protectedRoutes = ["/dashboard", "/buy-credits", "/results", "/success", "/cancel", "/chat"]

    // Admin protected routes — BUT exclude login page
    const isAdminProtected = request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login"

    const isUserProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    // Block normal access
    if (isUserProtected && !user) {
        const url = request.nextUrl.clone()
        url.pathname = "/auth/login"
        url.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // Block admin pages EXCEPT admin/login
    if (isAdminProtected && !user) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin/login"
        return NextResponse.redirect(url)
    }

    // If user is logged in but NOT admin → block admin pages
    if (isAdminProtected && user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (profile?.role !== "admin") {
            const url = request.nextUrl.clone()
            url.pathname = "/admin/login"
            return NextResponse.redirect(url)
        }
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    return supabaseResponse
}

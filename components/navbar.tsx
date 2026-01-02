"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/types"
import { Scale, Menu, X, Coins } from "lucide-react"
import { useState } from "react"
import SiteLogo from "./SiteLogo"

interface NavbarProps {
    user: User | null
}

export function Navbar({ user }: NavbarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/#pricing", label: "Pricing" },
        { href: "/#faq", label: "FAQs" },
    ]

    return (
        <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-b-[20px] lg:rounded-b-[40px]">
            <div className="container mx-auto flex items-center justify-between px-4 py-2">
                <SiteLogo />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10 lg:gap-20">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* Credits display */}
                            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5">
                                <Coins className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">{user.credits} Credits</span>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {user.email.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium text-foreground">{user.email}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/chat">Chat</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/buy-credits">Buy Credits</Link>
                                    </DropdownMenuItem>
                                    {user.role === "admin" && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/dashboard">Admin Panel</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center">
                            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                <Link href="/auth/login"  style={{background: 'var(--primary-gradient)'}} className="font-bold font-geist tracking-[-0.04em] text-white flex items-center gap-2 rounded-[50px]! py-5 px-8 ml-4 hover:brightness-95 transition-all cursor-pointer bodySub hover:text-white">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/sign-up" className="font-bold font-geist tracking-[-0.04em] text-primary! flex items-center gap-2 rounded-[50px]! py-5 px-8 ml-4 hover:brightness-95 transition-all cursor-pointer bodySub bg-transparent border border-primary hover:text-white!">Register</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border">
                    <nav className="flex flex-col p-4 gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                                        ? "bg-accent text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <Link
                                    href="/chat"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                                >
                                    Chat
                                </Link>
                                <div className="flex items-center gap-1.5 px-3 py-2 sm:hidden">
                                    <Coins className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">{user.credits} Credits</span>
                                </div>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}

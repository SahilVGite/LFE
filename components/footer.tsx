import Link from "next/link"
import { Scale, Twitter, Linkedin, Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-primary" />
                            <span className="font-bold text-foreground">LegalCaseAI</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            AI-powered legal research platform helping lawyers and legal professionals find relevant case law
                            efficiently.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#how-it-works"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    How it Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/buy-credits"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
                        <ul className="space-y-2">
                            <li className="text-sm text-muted-foreground">info@legalcaseai.com</li>
                            <li className="text-sm text-muted-foreground">+91 9876543210</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Join Our Newsletter</h4>
                        <div className="flex gap-2">
                            <Input type="email" placeholder="Your Email" className="bg-secondary" />
                            <Button>Subscribe</Button>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} LegalCaseAI. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}

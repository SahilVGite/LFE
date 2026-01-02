import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Scale, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                        <Scale className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">LegalCaseAI</span>
                    </Link>

                    <Card className="border-border">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Check your email</CardTitle>
                            <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground mb-6">
                                Please check your email and click the confirmation link to activate your account. Once confirmed, you
                                can start using LegalCaseAI.
                            </p>
                            <Button asChild variant="outline" className="w-full bg-transparent">
                                <Link href="/auth/login">Back to Login</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

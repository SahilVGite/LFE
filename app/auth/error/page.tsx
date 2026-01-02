import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Scale, AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ error: string }>
}) {
    const params = await searchParams

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
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Authentication Error</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            {params?.error ? (
                                <p className="text-sm text-muted-foreground mb-6">Error: {params.error}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground mb-6">
                                    An unspecified error occurred during authentication.
                                </p>
                            )}
                            <Button asChild className="w-full">
                                <Link href="/auth/login">Try Again</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

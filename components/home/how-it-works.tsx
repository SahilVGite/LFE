import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, FileText } from "lucide-react"

const steps = [
    {
        step: "Step 1",
        title: "Upload case summary",
        description:
            "This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.",
        icon: Upload,
    },
    {
        step: "Step 2",
        title: "Our system analyses landmark cases",
        description:
            "This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.",
        icon: Search,
    },
    {
        step: "Step 3",
        title: "Get a clear prediction report",
        description:
            "This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.",
        icon: FileText,
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4 text-primary">
                        How It Works
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                        Ready to assist you with anything you
                        <br />
                        need legally
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((item, index) => (
                        <Card key={index} className="relative bg-card border-border hover:shadow-lg transition-shadow">
                            <CardContent className="pt-8 pb-6 px-6 text-center">
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                                    {item.step}
                                </Badge>
                                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

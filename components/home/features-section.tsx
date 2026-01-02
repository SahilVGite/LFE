import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, AlertTriangle, Shield } from "lucide-react"
import Link from "next/link"

const features = [
    {
        icon: Clock,
        title: "Clear timeline",
        description:
            "This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.",
    },
    {
        icon: TrendingUp,
        title: "Success chances",
        description:
            "This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.",
    },
    {
        icon: AlertTriangle,
        title: "Risks and roadblocks",
        description:
            "This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.",
    },
    {
        icon: Shield,
        title: "Interim relief prediction",
        description:
            "This is dummy text will be replaced with original content. This is dummy text will be replaced with original content.",
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <Badge variant="secondary" className="mb-4 text-primary">
                            What You Get
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                            Predict timelines, identify risks, and
                            <br />
                            plan your path to victory
                        </h2>

                        {/* Preview images placeholder */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="aspect-[4/3] rounded-lg bg-card border border-border overflow-hidden shadow-lg">
                                <img
                                    src="/legal-chat-interface.jpg"
                                    alt="Legal chat interface"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="aspect-[4/3] rounded-lg bg-card border border-border overflow-hidden shadow-lg mt-8">
                                <img
                                    src="/case-analysis-preview.jpg"
                                    alt="Case analysis preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="aspect-[4/3] rounded-lg bg-card border border-border overflow-hidden shadow-lg">
                                <img
                                    src="/legal-document-preview.jpg"
                                    alt="Legal document preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/auth/sign-up">View All Features</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, FileText } from "lucide-react"
import BadgeTitle from "../BadgeTitle"

const steps = [
    {
        step: "Step 1",
        title: "Enter your case details",
        description:
            "This is dummy text will be replaced with original content",
        icon: Upload,
    },
    {
        step: "Step 2",
        title: "System analyses key factors",
        description:
            "This is dummy text will be replaced with original content",
        icon: Search,
    },
    {
        step: "Step 3",
        title: "Receive your report instantly within minutes",
        description:
            "This is dummy text will be replaced with original content",
        icon: FileText,
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="commonGap">
            <div className="container mx-auto px-4">
                <BadgeTitle className="text-center max-w-188 mx-auto mb-22.5" badge="How It Works" title="Ready to assist you with anything you need legally" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {steps.map((item, index) => (
                        <Card key={index} className="relative bg-card border-border hover:shadow-lg transition-shadow">
                            <CardContent className="p-3 text-center">
                                <Badge className="absolute top-3 left-3 bg-primary txtSub text-white font-medium font-geist tracking-[-0.04em] rounded-full">
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
                <div className="mt-25"><button className="text-white font-medium bodySub py-3.5 px-10 rounded-full mx-auto block cursor-pointer" style={{background: 'var(--primary-gradient)'}}>Preview Sample Report</button></div>
            </div>
        </section>
    )
}

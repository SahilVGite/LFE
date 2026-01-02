import { Badge } from "@/components/ui/badge"
import { Users, Database, HeartHandshake } from "lucide-react"

const trustPoints = [
    {
        icon: Users,
        title: "Built by litigation experts",
    },
    {
        icon: Database,
        title: "Backed by real case data",
    },
    {
        icon: HeartHandshake,
        title: "Designed with lawyers and clients",
    },
]

export function TrustSection() {
    return (
        <section className="py-20 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute left-0 top-0 w-48 h-48 opacity-10">
                <img src="/legal-gavel.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute right-0 bottom-0 w-48 h-48 opacity-10">
                <img src="/scales-of-justice.png" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4 text-primary">
                        Social Proof
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Why should you trust us?</h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
                    {trustPoints.map((point, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-4">
                                <point.icon className="h-10 w-10 text-primary" />
                            </div>
                            <p className="font-medium text-foreground max-w-[150px]">{point.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

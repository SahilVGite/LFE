import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrangeUpload, AnalysesKey, OrangeReport } from "../svg";
import BadgeTitle from "../BadgeTitle"

const steps = [
    {
        step: "Step 1",
        title: "Enter your case details",
        description:
            "This is dummy text will be replaced with original content",
        icon: OrangeUpload,
    },
    {
        step: "Step 2",
        title: "System analyses key factors",
        description:
            "This is dummy text will be replaced with original content",
        icon: AnalysesKey,
    },
    {
        step: "Step 3",
        title: "Receive your report instantly within minutes",
        description:
            "This is dummy text will be replaced with original content",
        icon: OrangeReport,
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="commonGap">
            <div className="sub-wrapper mx-auto px-4">
                <BadgeTitle className="text-center max-w-188 mx-auto mb-22.5" badge="How It Works" title="Ready to assist you with anything you need legally" />
                <div className="flex flex-wrap lg:flex-nowrap justify-center items-stretch gap-8 mx-auto">
                    {steps.map((item, index) => (
                        <Card key={index} className="relative border border-[#E3E3E3] shadow-[0px_13px_40px_4px_rgba(112,144,176,0.14)] rounded-3xl lg:rounded-[40px] py-4 px-4 lg:py-7 lg:px-7.5 w-full md:w-[calc(50%-32px)] lg:w-[calc(33.333%-32px)]">
                            <CardContent className="p-3 text-center">
                                <Badge className="absolute top-6 left-6 bg-primary txtSub text-white font-medium font-geist tracking-[-0.04em] rounded-full">
                                    {item.step}
                                </Badge>
                                <div className="w-fit p-6 rounded-full bg-[#FFF7EB] outline-2 outline-[#FFF7EB] border-8 border-white ring-1 ring-[#FFF7EB] flex items-center justify-center mx-auto mb-4">
                                    <item.icon />
                                </div>
                                <h3 className="font-semibold mb-2 subTitle text-[#212121]">{item.title}</h3>
                                <p className="text-[#747474] leading-[2em] body font-poppins">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-25"><button className="text-white font-medium bodySub py-3.5 px-10 rounded-full mx-auto block cursor-pointer" style={{background: 'var(--primary-gradient)'}}>Preview Sample Report</button></div>
            </div>
        </section>
    )
}

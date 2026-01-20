import { Badge } from "@/components/ui/badge"
import { SendOffers, OrangeFile, OrangeBalence } from "../svg";
import BadgeTitle from "../BadgeTitle"
import TrustCards from "./TrustCards";

const trustPoints = [
    {
        icon: SendOffers,
        title: "100% confidential",
    },
    {
        icon: OrangeFile,
        title: "Used by litigants across India",
    },
    {
        icon: OrangeBalence,
        title: "Lawyer-led platform",
    },
]

export function TrustSection() {
    return (
        <section className="commonGap relative">
            <div className="max-w-[80%] lg:max-w-272.5 mx-auto">
                <BadgeTitle badge="Trust Indicators" title="Why should you trust us?" className="mb-6 md:mb-10 lg:mb-16 text-center" />
                <div className="flex items-stretch justify-center flex-wrap gap-5 lg:gap-22">
                    {trustPoints.map((values, index) => (
                        <TrustCards key={index} list={values} />
                    ))}
                </div>
            </div>
        </section>
    )
}

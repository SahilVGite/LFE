import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BadgeTitle from "../BadgeTitle";

const faqs = [
    {
        question: "What is LegalCaseAI and how does it work?",
        answer:
            "LegalCaseAI is an AI-powered legal research platform that helps you find relevant case law. Simply enter your legal query, and our system searches through our database of cases. If no matching case is found, we use AI to generate relevant case analysis for a small credit cost.",
    },
    {
        question: "Is my data secure on LegalCaseAI?",
        answer:
            "Yes, we take data security very seriously. All your searches and data are encrypted and stored securely. We never share your information with third parties.",
    },
    {
        question: "Can I talk to a real lawyer through LegalCaseAI?",
        answer:
            "LegalCaseAI is designed to assist with legal research, not to replace professional legal advice. We recommend consulting with a qualified lawyer for specific legal matters.",
    },
    {
        question: "Can I control who sees my content on LegalCaseAI?",
        answer:
            "Yes, your search history and generated content are private to your account. Only you can access your searches and saved cases.",
    },
    {
        question: "Can I use LegalCaseAI on multiple devices?",
        answer:
            "Yes, LegalCaseAI is fully responsive and works on desktop, tablet, and mobile devices. Your account syncs across all devices.",
    },
]

export function FAQSection() {
    return (
        <section id="faq" className="commonGap">
            <div className="container mx-auto px-4">
                <div className="flex justify-between gap-12 items-start flex-wrap-reverse md:flex-nowrap mx-auto">
                    <div className="w-full max-w-full md:max-w-[30%]">
                        <div className="aspect-[0.70/1] rounded-2xl overflow-hidden">
                            <img src="/hmFaq.png" alt="Lawyer at desk" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="max-w-full md:max-w-[70%] w-full">
                        <BadgeTitle badge="FAQs" title="Have a question?" className="mb-5 lg:mb-13.5" />
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}

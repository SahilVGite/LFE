import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { FeaturesSection } from "@/components/home/features-section"
import { TrustSection } from "@/components/home/trust-section"
import { FAQSection } from "@/components/home/faq-section"

export default async function HomePage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser() 

    let profile = null
    if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        profile = data
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={profile} />
            <main className="flex-1">
                <HeroSection isLoggedIn={!!user} />
                <HowItWorks />
                <FeaturesSection />
                <TrustSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    )
}

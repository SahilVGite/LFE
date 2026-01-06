import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturesSection } from "@/components/home/features-section";
import { TrustSection } from "@/components/home/trust-section";
import { FAQSection } from "@/components/home/faq-section";
import BlogSec from "@/components/home/blogs";
import CoreValues from "@/components/home/CoreValues";
import Pricing from "@/components/home/Pricing";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <>
      <HeroSection isLoggedIn={!!user} />
      {/* <FeaturesSection /> */}
      <Pricing />
      <TrustSection />
      <CoreValues />
      <HowItWorks />
      <FAQSection />
      <BlogSec />
    </>
  );
}

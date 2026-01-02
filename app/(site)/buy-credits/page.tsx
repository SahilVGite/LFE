import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BuyCreditsContent } from "@/components/payments/buy-credits-content";

export default async function BuyCreditsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/buy-credits");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BuyCreditsContent
        currentCredits={profile.credits}
        userEmail={profile.email}
      />
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Coins, ArrowRight } from "lucide-react";

export default async function SuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
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
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border">
        <CardHeader className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Your credits have been added to your account. You can now use them
            for AI-powered legal case generation.
          </p>

          <div className="bg-accent rounded-lg p-4">
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Current Balance: {profile.credits} credits
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/">
                Start Searching
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

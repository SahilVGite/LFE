import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    profile = data
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={profile} />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </div>
  )
}

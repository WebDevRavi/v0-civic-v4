import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CommunityFeed } from "@/components/community/community-feed"
import { CommunityFilters } from "@/components/community/community-filters"

export default async function CommunityPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Feed</h1>
          <p className="text-muted-foreground">
            Engage with your community by viewing, voting on, and commenting on civic issues
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CommunityFilters />
          </div>
          <div className="lg:col-span-3">
            <CommunityFeed userId={data.user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

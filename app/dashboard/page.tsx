import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { IssueStats } from "@/components/dashboard/issue-stats"
import { RecentIssues } from "@/components/dashboard/recent-issues"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
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
        <div className="grid gap-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <IssueStats />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          <RecentIssues userId={data.user.id} />
        </div>
      </main>
    </div>
  )
}

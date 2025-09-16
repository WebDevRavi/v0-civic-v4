import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { IssueReportForm } from "@/components/forms/issue-report-form"

export default async function ReportIssuePage() {
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
            <p className="text-muted-foreground">
              Help improve your community by reporting civic issues that need attention
            </p>
          </div>

          <IssueReportForm userId={data.user.id} />
        </div>
      </main>
    </div>
  )
}

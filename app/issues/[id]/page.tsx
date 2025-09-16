import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { IssueDetails } from "@/components/issues/issue-details"
import { IssueComments } from "@/components/issues/issue-comments"

interface IssuePageProps {
  params: Promise<{ id: string }>
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params
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

  // Get issue details
  const { data: issue } = await supabase
    .from("issues")
    .select(`
      *,
      profiles:reporter_id (full_name, email)
    `)
    .eq("id", id)
    .single()

  if (!issue) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <IssueDetails issue={issue} userId={data.user.id} />
          <IssueComments issueId={id} userId={data.user.id} />
        </div>
      </main>
    </div>
  )
}

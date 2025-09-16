import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { IssueMap } from "@/components/map/issue-map"
import { MapFilters } from "@/components/map/map-filters"

export default async function MapPage() {
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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Issue Map</h1>
            <p className="text-muted-foreground">Visualize civic issues across your community on an interactive map</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MapFilters />
            </div>
            <div className="lg:col-span-3">
              <IssueMap userId={data.user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

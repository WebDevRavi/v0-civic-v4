import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { UserManagement } from "@/components/admin/user-management"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile and check admin role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage registered users and their roles</p>
          </div>

          <UserManagement />
        </div>
      </main>
    </div>
  )
}

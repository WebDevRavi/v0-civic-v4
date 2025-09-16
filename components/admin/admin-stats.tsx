"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Users, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface AdminStatsData {
  totalIssues: number
  openIssues: number
  inProgressIssues: number
  resolvedIssues: number
  totalUsers: number
  todayIssues: number
}

export function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData>({
    totalIssues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
    totalUsers: 0,
    todayIssues: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      // Get issue stats
      const { data: issues } = await supabase.from("issues").select("status, created_at")

      // Get user count
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

      if (issues) {
        const today = new Date().toDateString()
        const todayIssues = issues.filter((issue) => new Date(issue.created_at).toDateString() === today).length

        const statsData = issues.reduce(
          (acc, issue) => {
            acc.totalIssues++
            if (issue.status === "open") acc.openIssues++
            else if (issue.status === "in_progress") acc.inProgressIssues++
            else if (issue.status === "resolved") acc.resolvedIssues++
            return acc
          },
          {
            totalIssues: 0,
            openIssues: 0,
            inProgressIssues: 0,
            resolvedIssues: 0,
            totalUsers: userCount || 0,
            todayIssues,
          },
        )

        setStats(statsData)
      }
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse">Loading admin stats...</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalIssues}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.openIssues}</div>
          <p className="text-xs text-muted-foreground">Needs attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.inProgressIssues}</div>
          <p className="text-xs text-muted-foreground">Being worked on</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">{stats.resolvedIssues}</div>
          <p className="text-xs text-muted-foreground">Completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayIssues}</div>
          <p className="text-xs text-muted-foreground">New issues</p>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Stats {
  total: number
  open: number
  inProgress: number
  resolved: number
}

export function IssueStats() {
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, inProgress: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const { data: issues } = await supabase.from("issues").select("status")

      if (issues) {
        const stats = issues.reduce(
          (acc, issue) => {
            acc.total++
            if (issue.status === "open") acc.open++
            else if (issue.status === "in_progress") acc.inProgress++
            else if (issue.status === "resolved") acc.resolved++
            return acc
          },
          { total: 0, open: 0, inProgress: 0, resolved: 0 },
        )

        setStats(stats)
      }
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse">Loading stats...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Community Overview</h2>
        <p className="text-muted-foreground">Track the progress of civic issues in your area</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

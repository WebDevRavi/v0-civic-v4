"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface CategoryStats {
  category: string
  count: number
  percentage: number
}

interface PriorityStats {
  priority: string
  count: number
  percentage: number
}

export function AdminAnalytics() {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [priorityStats, setPriorityStats] = useState<PriorityStats[]>([])
  const [resolutionRate, setResolutionRate] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    const supabase = createClient()

    const { data: issues } = await supabase.from("issues").select("category, priority, status")

    if (issues) {
      const totalIssues = issues.length

      // Category stats
      const categoryCount = issues.reduce(
        (acc, issue) => {
          acc[issue.category] = (acc[issue.category] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const categoryStatsData = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
        percentage: (count / totalIssues) * 100,
      }))

      // Priority stats
      const priorityCount = issues.reduce(
        (acc, issue) => {
          acc[issue.priority] = (acc[issue.priority] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const priorityStatsData = Object.entries(priorityCount).map(([priority, count]) => ({
        priority,
        count,
        percentage: (count / totalIssues) * 100,
      }))

      // Resolution rate
      const resolvedCount = issues.filter((issue) => issue.status === "resolved").length
      const resolutionRate = totalIssues > 0 ? (resolvedCount / totalIssues) * 100 : 0

      setCategoryStats(categoryStatsData)
      setPriorityStats(priorityStatsData)
      setResolutionRate(resolutionRate)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="animate-pulse">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resolution Rate</CardTitle>
          <CardDescription>Percentage of issues resolved</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Resolution</span>
              <span>{resolutionRate.toFixed(1)}%</span>
            </div>
            <Progress value={resolutionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Issues by Category</CardTitle>
          <CardDescription>Distribution of issue types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{stat.category}</span>
                  <span>{stat.count}</span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Priority Distribution</CardTitle>
          <CardDescription>Issues by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priorityStats.map((stat) => (
              <div key={stat.priority} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{stat.priority}</span>
                  <span>{stat.count}</span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

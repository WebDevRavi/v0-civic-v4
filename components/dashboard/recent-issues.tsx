"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Eye, MessageSquare, ThumbsUp } from "lucide-react"
import Link from "next/link"

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  location_address: string
  created_at: string
  profiles: {
    full_name: string
  }
}

interface RecentIssuesProps {
  userId: string
}

export function RecentIssues({ userId }: RecentIssuesProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentIssues = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("issues")
        .select(`
          *,
          profiles:reporter_id (full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      if (data) {
        setIssues(data as Issue[])
      }
      setLoading(false)
    }

    fetchRecentIssues()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in_progress":
        return "default"
      case "resolved":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading recent issues...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Issues</CardTitle>
            <CardDescription>Latest reports from your community</CardDescription>
          </div>
          <Link href="/community">
            <Button variant="outline" size="sm" className="bg-transparent">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No issues reported yet. Be the first to report an issue!
            </p>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-sm">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                    <p className="text-xs text-muted-foreground">📍 {issue.location_address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(issue.status)} className="text-xs">
                      {issue.status.replace("_", " ")}
                    </Badge>
                    <Badge variant={getPriorityColor(issue.priority)} className="text-xs">
                      {issue.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {issue.category}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Reported by {issue.profiles?.full_name || "Anonymous"}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">0</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span className="text-xs">0</span>
                    </Button>
                    <Link href={`/issues/${issue.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="text-xs">View</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

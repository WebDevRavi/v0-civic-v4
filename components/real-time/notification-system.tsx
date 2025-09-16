"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface NotificationSystemProps {
  userId: string
}

export function NotificationSystem({ userId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to issue updates
    const issueSubscription = supabase
      .channel("issue_updates")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "issues" }, (payload) => {
        const issue = payload.new as any
        const oldIssue = payload.old as any

        // Show notification for status changes
        if (issue.status !== oldIssue.status) {
          const statusMessages = {
            in_progress: "Issue is now being worked on",
            resolved: "Issue has been resolved",
            closed: "Issue has been closed",
          }

          const statusIcons = {
            in_progress: Clock,
            resolved: CheckCircle,
            closed: AlertTriangle,
          }

          const message = statusMessages[issue.status as keyof typeof statusMessages]
          const Icon = statusIcons[issue.status as keyof typeof statusIcons]

          if (message && Icon) {
            toast(issue.title, {
              description: message,
              icon: <Icon className="h-4 w-4" />,
              duration: 5000,
            })
          }
        }
      })
      .subscribe()

    // Subscribe to new issues
    const newIssueSubscription = supabase
      .channel("new_issues")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "issues" }, (payload) => {
        const issue = payload.new as any

        toast("New Issue Reported", {
          description: issue.title,
          icon: <Bell className="h-4 w-4" />,
          duration: 5000,
        })
      })
      .subscribe()

    // Subscribe to new comments on user's issues
    const commentSubscription = supabase
      .channel("comment_updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, async (payload) => {
        const comment = payload.new as any

        // Check if this comment is on user's issue
        const { data: issue } = await supabase
          .from("issues")
          .select("title, reporter_id")
          .eq("id", comment.issue_id)
          .single()

        if (issue && issue.reporter_id === userId) {
          toast("New Comment", {
            description: `Someone commented on "${issue.title}"`,
            icon: <Bell className="h-4 w-4" />,
            duration: 5000,
          })
        }
      })
      .subscribe()

    return () => {
      issueSubscription.unsubscribe()
      newIssueSubscription.unsubscribe()
      commentSubscription.unsubscribe()
    }
  }, [userId])

  return null // This component only handles notifications
}

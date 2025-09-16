"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MessageSquare, Send } from "lucide-react"

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    full_name: string
  }
}

interface IssueCommentsProps {
  issueId: string
  userId: string
}

export function IssueComments({ issueId, userId }: IssueCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [issueId])

  const fetchComments = async () => {
    const supabase = createClient()

    const { data } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq("issue_id", issueId)
      .order("created_at", { ascending: true })

    if (data) {
      setComments(data as Comment[])
    }
    setLoading(false)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase.from("comments").insert({
      issue_id: issueId,
      user_id: userId,
      content: newComment.trim(),
    })

    if (!error) {
      setNewComment("")
      fetchComments()
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div className="animate-pulse">Loading comments...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Add your comment or suggestion..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={submitting || !newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4 p-4 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {comment.profiles?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{comment.profiles?.full_name || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

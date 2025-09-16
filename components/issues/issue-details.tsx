"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, ThumbsDown, MapPin, Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  location_address: string
  image_url: string | null
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

interface IssueDetailsProps {
  issue: Issue
  userId: string
}

export function IssueDetails({ issue, userId }: IssueDetailsProps) {
  const [voteData, setVoteData] = useState({
    upvotes: 0,
    downvotes: 0,
    userVote: null as string | null,
  })

  useEffect(() => {
    fetchVoteData()
  }, [issue.id, userId])

  const fetchVoteData = async () => {
    const supabase = createClient()

    // Get vote counts
    const { data: votes } = await supabase.from("votes").select("vote_type").eq("issue_id", issue.id)

    // Get user's vote
    const { data: userVote } = await supabase
      .from("votes")
      .select("vote_type")
      .eq("issue_id", issue.id)
      .eq("user_id", userId)
      .single()

    const upvotes = votes?.filter((v) => v.vote_type === "upvote").length || 0
    const downvotes = votes?.filter((v) => v.vote_type === "downvote").length || 0

    setVoteData({
      upvotes,
      downvotes,
      userVote: userVote?.vote_type || null,
    })
  }

  const handleVote = async (voteType: "upvote" | "downvote") => {
    const supabase = createClient()

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("issue_id", issue.id)
      .eq("user_id", userId)
      .single()

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking same vote type
        await supabase.from("votes").delete().eq("id", existingVote.id)
      } else {
        // Update vote type
        await supabase.from("votes").update({ vote_type: voteType }).eq("id", existingVote.id)
      }
    } else {
      // Create new vote
      await supabase.from("votes").insert({
        issue_id: issue.id,
        user_id: userId,
        vote_type: voteType,
      })
    }

    // Refresh vote data
    fetchVoteData()
  }

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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/community">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
      </Link>

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {issue.profiles?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{issue.profiles?.full_name || "Anonymous"}</p>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(issue.status)}>{issue.status.replace("_", " ").toUpperCase()}</Badge>
                <Badge variant={getPriorityColor(issue.priority)}>{issue.priority.toUpperCase()}</Badge>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold">{issue.title}</h1>

            {/* Meta Information */}
            <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{issue.location_address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(issue.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{issue.category}</Badge>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">{issue.description}</p>
            </div>

            {/* Image */}
            {issue.image_url && (
              <div className="relative h-96 w-full rounded-lg overflow-hidden">
                <Image src={issue.image_url || "/placeholder.svg"} alt={issue.title} fill className="object-cover" />
              </div>
            )}

            {/* Voting */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={voteData.userVote === "upvote" ? "default" : "outline"}
                    onClick={() => handleVote("upvote")}
                    className="bg-transparent"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {voteData.upvotes}
                  </Button>
                  <Button
                    variant={voteData.userVote === "downvote" ? "destructive" : "outline"}
                    onClick={() => handleVote("downvote")}
                    className="bg-transparent"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    {voteData.downvotes}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">Net votes: {voteData.upvotes - voteData.downvotes}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

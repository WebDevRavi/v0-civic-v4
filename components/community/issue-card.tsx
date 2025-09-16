"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, ThumbsDown, MessageSquare, MapPin, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  }
  vote_count: number
  upvotes: number
  downvotes: number
  comment_count: number
  user_vote: string | null
}

interface IssueCardProps {
  issue: Issue
  onVote: (issueId: string, voteType: "upvote" | "downvote") => void
  userId: string
}

export function IssueCard({ issue, onVote, userId }: IssueCardProps) {
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
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {issue.profiles?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{issue.profiles?.full_name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusColor(issue.status)} className="text-xs">
                {issue.status.replace("_", " ")}
              </Badge>
              <Badge variant={getPriorityColor(issue.priority)} className="text-xs">
                {issue.priority}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{issue.title}</h3>
            <p className="text-muted-foreground line-clamp-3">{issue.description}</p>

            {/* Location */}
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {issue.location_address}
            </div>

            {/* Category */}
            <Badge variant="outline" className="w-fit">
              {issue.category}
            </Badge>

            {/* Image */}
            {issue.image_url && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image src={issue.image_url || "/placeholder.svg"} alt={issue.title} fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-1">
              {/* Voting */}
              <Button
                variant={issue.user_vote === "upvote" ? "default" : "ghost"}
                size="sm"
                onClick={() => onVote(issue.id, "upvote")}
                className="h-8"
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                <span className="text-xs">{issue.upvotes}</span>
              </Button>

              <Button
                variant={issue.user_vote === "downvote" ? "destructive" : "ghost"}
                size="sm"
                onClick={() => onVote(issue.id, "downvote")}
                className="h-8"
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                <span className="text-xs">{issue.downvotes}</span>
              </Button>

              {/* Net vote count */}
              <div className="px-2 py-1 text-sm font-medium">
                {issue.vote_count > 0 ? `+${issue.vote_count}` : issue.vote_count}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Comments */}
              <Link href={`/issues/${issue.id}`}>
                <Button variant="ghost" size="sm" className="h-8">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span className="text-xs">{issue.comment_count}</span>
                </Button>
              </Link>

              {/* View Details */}
              <Link href={`/issues/${issue.id}`}>
                <Button variant="outline" size="sm" className="h-8 bg-transparent">
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="text-xs">View</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

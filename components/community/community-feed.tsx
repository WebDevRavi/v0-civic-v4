"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { IssueCard } from "@/components/community/issue-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

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

interface CommunityFeedProps {
  userId: string
}

export function CommunityFeed({ userId }: CommunityFeedProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchIssues()
  }, [userId])

  const fetchIssues = async () => {
    const supabase = createClient()

    // Get issues with vote counts and user's vote
    const { data: issuesData } = await supabase
      .from("issues")
      .select(`
        *,
        profiles:reporter_id (full_name)
      `)
      .order("created_at", { ascending: false })

    if (issuesData) {
      // Get vote counts and user votes for each issue
      const issuesWithVotes = await Promise.all(
        issuesData.map(async (issue) => {
          // Get vote counts
          const { data: votes } = await supabase.from("votes").select("vote_type").eq("issue_id", issue.id)

          // Get user's vote
          const { data: userVote } = await supabase
            .from("votes")
            .select("vote_type")
            .eq("issue_id", issue.id)
            .eq("user_id", userId)
            .single()

          // Get comment count
          const { count: commentCount } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("issue_id", issue.id)

          const upvotes = votes?.filter((v) => v.vote_type === "upvote").length || 0
          const downvotes = votes?.filter((v) => v.vote_type === "downvote").length || 0

          return {
            ...issue,
            vote_count: upvotes - downvotes,
            upvotes,
            downvotes,
            comment_count: commentCount || 0,
            user_vote: userVote?.vote_type || null,
          }
        }),
      )

      setIssues(issuesWithVotes as Issue[])
    }
    setLoading(false)
  }

  const handleVote = async (issueId: string, voteType: "upvote" | "downvote") => {
    const supabase = createClient()

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("issue_id", issueId)
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
        issue_id: issueId,
        user_id: userId,
        vote_type: voteType,
      })
    }

    // Refresh issues
    fetchIssues()
  }

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location_address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="animate-pulse">Loading community feed...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/report-issue">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No issues found matching your search." : "No issues reported yet."}
            </p>
            <Link href="/report-issue">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Report First Issue
              </Button>
            </Link>
          </div>
        ) : (
          filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} onVote={handleVote} userId={userId} />)
        )}
      </div>
    </div>
  )
}

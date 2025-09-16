"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, Eye, MapPin, User } from "lucide-react"
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

export function AdminIssuesList() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    fetchIssues()
  }, [])

  useEffect(() => {
    filterIssues()
  }, [issues, searchTerm, statusFilter, priorityFilter])

  const fetchIssues = async () => {
    const supabase = createClient()

    const { data } = await supabase
      .from("issues")
      .select(`
        *,
        profiles:reporter_id (full_name)
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setIssues(data as Issue[])
    }
    setLoading(false)
  }

  const filterIssues = () => {
    let filtered = issues

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.location_address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter)
    }

    setFilteredIssues(filtered)
  }

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
    const supabase = createClient()

    const { error } = await supabase
      .from("issues")
      .update({
        status: newStatus,
        resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
      })
      .eq("id", issueId)

    if (!error) {
      fetchIssues()
    }
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

  if (loading) {
    return <div className="animate-pulse">Loading issues...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Management</CardTitle>
        <CardDescription>Review and manage all reported civic issues</CardDescription>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "No issues match your filters."
                : "No issues reported yet."}
            </p>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{issue.location_address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{issue.profiles?.full_name || "Anonymous"}</span>
                      </div>
                      <span>{formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                    </div>
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

                  <div className="flex items-center space-x-2">
                    <Select value={issue.status} onValueChange={(value) => updateIssueStatus(issue.id, value)}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>

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

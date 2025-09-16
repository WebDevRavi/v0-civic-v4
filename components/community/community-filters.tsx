"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface CommunityFiltersProps {
  onFiltersChange?: (filters: {
    category: string
    status: string
    priority: string
    sortBy: string
  }) => void
}

export function CommunityFilters({ onFiltersChange }: CommunityFiltersProps) {
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    priority: "all",
    sortBy: "newest",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      category: "all",
      status: "all",
      priority: "all",
      sortBy: "newest",
    }
    setFilters(defaultFilters)
    onFiltersChange?.(defaultFilters)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="sanitation">Sanitation</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most_voted">Most Voted</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Clear Filters
        </Button>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Open Issues</span>
              <Badge variant="destructive">24</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>In Progress</span>
              <Badge variant="default">12</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Resolved</span>
              <Badge variant="secondary">156</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

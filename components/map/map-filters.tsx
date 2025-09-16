"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

interface MapFiltersProps {
  onFiltersChange?: (filters: {
    categories: string[]
    statuses: string[]
    priorities: string[]
    showResolved: boolean
  }) => void
}

export function MapFilters({ onFiltersChange }: MapFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [showResolved, setShowResolved] = useState(true)

  const categories = ["infrastructure", "sanitation", "utilities", "safety", "environment", "other"]
  const statuses = ["open", "in_progress", "resolved", "closed"]
  const priorities = ["urgent", "high", "medium", "low"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category)
    setSelectedCategories(newCategories)
    updateFilters(newCategories, selectedStatuses, selectedPriorities, showResolved)
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked ? [...selectedStatuses, status] : selectedStatuses.filter((s) => s !== status)
    setSelectedStatuses(newStatuses)
    updateFilters(selectedCategories, newStatuses, selectedPriorities, showResolved)
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriorities = checked ? [...selectedPriorities, priority] : selectedPriorities.filter((p) => p !== priority)
    setSelectedPriorities(newPriorities)
    updateFilters(selectedCategories, selectedStatuses, newPriorities, showResolved)
  }

  const updateFilters = (categories: string[], statuses: string[], priorities: string[], resolved: boolean) => {
    onFiltersChange?.({
      categories,
      statuses,
      priorities,
      showResolved: resolved,
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedStatuses([])
    setSelectedPriorities([])
    setShowResolved(true)
    updateFilters([], [], [], true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Map Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <label htmlFor={`category-${category}`} className="text-sm capitalize cursor-pointer">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Status</h4>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                />
                <label htmlFor={`status-${status}`} className="text-sm capitalize cursor-pointer">
                  {status.replace("_", " ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Priority</h4>
          <div className="space-y-2">
            {priorities.map((priority) => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox
                  id={`priority-${priority}`}
                  checked={selectedPriorities.includes(priority)}
                  onCheckedChange={(checked) => handlePriorityChange(priority, checked as boolean)}
                />
                <label htmlFor={`priority-${priority}`} className="text-sm capitalize cursor-pointer">
                  {priority}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-resolved"
              checked={showResolved}
              onCheckedChange={(checked) => {
                setShowResolved(checked as boolean)
                updateFilters(selectedCategories, selectedStatuses, selectedPriorities, checked as boolean)
              }}
            />
            <label htmlFor="show-resolved" className="text-sm cursor-pointer">
              Show resolved issues
            </label>
          </div>
        </div>

        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Clear All Filters
        </Button>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-xs">Open/Urgent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-xs">Resolved</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

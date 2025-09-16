"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MapPin, Navigation, Zap } from "lucide-react"
import Link from "next/link"

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  location_address: string
  latitude: number | null
  longitude: number | null
  created_at: string
  profiles: {
    full_name: string
  }
}

interface IssueMapProps {
  userId: string
}

export function IssueMap({ userId }: IssueMapProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    fetchIssues()
    getCurrentLocation()

    // Set up real-time subscription
    const supabase = createClient()
    const subscription = supabase
      .channel("issues_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "issues" }, (payload) => {
        console.log("[v0] Real-time update received:", payload)
        fetchIssues() // Refresh issues when changes occur
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchIssues = async () => {
    const supabase = createClient()

    const { data } = await supabase
      .from("issues")
      .select(`
        *,
        profiles:reporter_id (full_name)
      `)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false })

    if (data) {
      setIssues(data as Issue[])
    }
    setLoading(false)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const getMarkerColor = (issue: Issue) => {
    if (issue.status === "resolved") return "bg-secondary"
    if (issue.status === "in_progress") return "bg-primary"
    if (issue.priority === "urgent" || issue.priority === "high") return "bg-destructive"
    return "bg-muted-foreground"
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

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading map...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Map Placeholder - In a real implementation, this would be an actual map */}
      <Card className="h-96 relative overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="relative h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-muted-foreground/20"></div>
                ))}
              </div>
            </div>

            {/* User Location */}
            {userLocation && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
                </div>
              </div>
            )}

            {/* Issue Markers */}
            {issues.map((issue, index) => (
              <div
                key={issue.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: `${20 + (index % 5) * 15}%`,
                  left: `${15 + (index % 6) * 12}%`,
                }}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="relative group">
                  <div className={`w-6 h-6 ${getMarkerColor(issue)} rounded-full border-2 border-white shadow-lg`}>
                    <MapPin className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  {issue.priority === "urgent" && (
                    <Zap className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
                  )}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">{issue.title}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="outline" onClick={getCurrentLocation} className="bg-white/90">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Info */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 rounded-lg p-3">
              <div className="text-sm font-medium mb-2">Issues on Map</div>
              <div className="text-2xl font-bold text-primary">{issues.length}</div>
              <div className="text-xs text-muted-foreground">Total locations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Issue Details */}
      {selectedIssue && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedIssue.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedIssue.location_address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(selectedIssue.status)} className="text-xs">
                    {selectedIssue.status.replace("_", " ")}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedIssue(null)}>
                    ×
                  </Button>
                </div>
              </div>

              <p className="text-sm">{selectedIssue.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedIssue.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedIssue.priority}
                  </Badge>
                </div>
                <Link href={`/issues/${selectedIssue.id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Issues with Location Data</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {issues.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No issues with location data found. Issues need GPS coordinates to appear on the map.
                </p>
              ) : (
                issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${getMarkerColor(issue)} rounded-full`}></div>
                      <div>
                        <p className="font-medium text-sm">{issue.title}</p>
                        <p className="text-xs text-muted-foreground">{issue.location_address}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(issue.status)} className="text-xs">
                      {issue.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

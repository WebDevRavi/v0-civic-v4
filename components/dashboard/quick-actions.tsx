import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and navigation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/report-issue" className="block">
          <Button className="w-full justify-start" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Report New Issue
          </Button>
        </Link>

        <Link href="/community" className="block">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Community Feed
          </Button>
        </Link>

        <Link href="/map" className="block">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <MapPin className="mr-2 h-4 w-4" />
            Issue Map
          </Button>
        </Link>

        <Link href="/analytics" className="block">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

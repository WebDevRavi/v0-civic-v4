import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Janmitran</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Empowering Citizens
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Your Voice, Your Community, <span className="text-primary">Your Change</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Report civic issues, engage with your community, and track real-time progress on local improvements.
            Together, we build better neighborhoods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Reporting Issues
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Explore Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How Janmitran Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and effective civic engagement platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Report Issues</CardTitle>
                <CardDescription>
                  Easily report civic problems with photos, location, and detailed descriptions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Community Engagement</CardTitle>
                <CardDescription>
                  Vote on issues, add comments, and collaborate with neighbors for solutions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor real-time updates and see how your reports lead to actual improvements
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1,247</div>
              <div className="text-muted-foreground">Issues Reported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">892</div>
              <div className="text-muted-foreground">Issues Resolved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">3,456</div>
              <div className="text-muted-foreground">Active Citizens</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15</div>
              <div className="text-muted-foreground">Partner Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Janmitran. Empowering communities through civic engagement.</p>
        </div>
      </footer>
    </div>
  )
}

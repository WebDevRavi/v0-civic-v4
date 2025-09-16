import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, MapPin } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Janmitran</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We've sent you a verification link to confirm your account</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email inbox and click the verification link to activate your account. Once verified, you
              can sign in and start engaging with your civic community.
            </p>
            <div className="pt-4">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

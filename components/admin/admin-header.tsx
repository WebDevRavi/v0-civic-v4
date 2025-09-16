"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MapPin, LogOut, Settings, Users, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationSystem } from "@/components/real-time/notification-system"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string
  role: string
  email: string
}

interface AdminHeaderProps {
  user: SupabaseUser
  profile: Profile
}

export function AdminHeader({ user, profile }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <NotificationSystem userId={user.id} />

      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Janmitran</h1>
              <Badge variant="secondary" className="ml-2">
                Admin
              </Badge>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  Community View
                </Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {profile.full_name}</span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <Badge variant="outline" className="w-fit mt-1">
                        {profile.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

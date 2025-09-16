"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, Mail, Phone, MapPin, Calendar } from "lucide-react"

interface User {
  id: string
  email: string
  full_name: string
  phone: string | null
  address: string | null
  role: string
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  const fetchUsers = async () => {
    const supabase = createClient()

    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (data) {
      setUsers(data as User[])
    }
    setLoading(false)
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

    if (!error) {
      fetchUsers()
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "citizen":
        return "default"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading users...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Users</CardTitle>
        <CardDescription>Manage user accounts and roles</CardDescription>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="citizen">Citizens</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm || roleFilter !== "all" ? "No users match your filters." : "No users registered yet."}
            </p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {user.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{user.full_name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                      {user.address && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{user.address}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleColor(user.role)} className="text-xs">
                      {user.role}
                    </Badge>
                    <Select value={user.role} onValueChange={(value) => updateUserRole(user.id, value)}>
                      <SelectTrigger className="h-8 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
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

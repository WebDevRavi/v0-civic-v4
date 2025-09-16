"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Upload, MapPin } from "lucide-react"

interface IssueReportFormProps {
  userId: string
}

export function IssueReportForm({ userId }: IssueReportFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location_address: "",
    latitude: "",
    longitude: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      let imageUrl = null

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("issue-images").upload(fileName, imageFile)

        if (uploadError) {
          throw new Error("Failed to upload image")
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("issue-images").getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Create issue
      const { error: insertError } = await supabase.from("issues").insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location_address: formData.location_address,
        latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
        image_url: imageUrl,
        reporter_id: userId,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-secondary" />
          </div>
          <CardTitle className="text-2xl">Issue Reported Successfully!</CardTitle>
          <CardDescription>
            Your report has been submitted and will be reviewed by the appropriate authorities.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Details</CardTitle>
        <CardDescription>
          Provide as much detail as possible to help authorities address the issue effectively
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the issue, including when you noticed it and any relevant context"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location Address *</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                placeholder="Street address or landmark"
                value={formData.location_address}
                onChange={(e) => handleInputChange("location_address", e.target.value)}
                required
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={getCurrentLocation} className="bg-transparent">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {formData.latitude && formData.longitude && (
              <p className="text-xs text-muted-foreground">
                GPS coordinates captured: {Number.parseFloat(formData.latitude).toFixed(6)},{" "}
                {Number.parseFloat(formData.longitude).toFixed(6)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Photo (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Adding a photo helps authorities understand and prioritize the issue
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Submitting Report..." : "Submit Issue Report"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

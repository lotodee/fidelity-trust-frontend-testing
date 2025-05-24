"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function EditUser({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("customer")
  const [balance, setBalance] = useState("0")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const response = await usersAPI.getUserById(params.id)
      const userData = response.user
      setUser(userData)

      // Set form values
      setFirstName(userData.firstName)
      setLastName(userData.lastName)
      setEmail(userData.email)
      setRole(userData.role)
      setBalance(userData.balance.toString())
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
      })
      router.push("/admin/users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !email) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      })
      return
    }

    setIsSaving(true)
    try {
      await usersAPI.updateUser(params.id, {
        firstName,
        lastName,
        email,
        role,
        balance: Number.parseFloat(balance),
      })

      toast({
        title: "User updated",
        description: "The user has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
            <CardDescription>Update user information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">Balance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="balance"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-8"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

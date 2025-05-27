"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Shield, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSignupStore } from "@/lib/store/signup"
import { useAuthStore } from "@/lib/store/auth"
import { Informer } from "@/components/ui/informer"

const steps = [
  { number: 1, title: "Personal Information", icon: User },
  { number: 2, title: "Identity Verification", icon: Shield },
  { number: 3, title: "Security Setup", icon: Lock },
]

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [informerMessage, setInformerMessage] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  const {
    currentStep,
    personalInfo,
    identityInfo,
    pinInfo,
    isLoading,
    kycStatus,
    setPersonalInfo,
    setIdentityInfo,
    setPinInfo,
    setLoading,
    setKycStatus,
    nextStep,
    prevStep,
    resetForm,
  } = useSignupStore()

  const { register } = useAuthStore()

  const progress = (currentStep / 3) * 100

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"]
    const missing = required.filter((field) => !personalInfo[field as keyof typeof personalInfo])

    if (missing.length > 0) {
      setInformerMessage({
        message: "Please fill in all required fields",
        type: "error",
      })
      return
    }

    nextStep()
  }

  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (identityInfo.password !== identityInfo.confirmPassword) {
      setInformerMessage({
        message: "Passwords don't match",
        type: "error",
      })
      return
    }

    if (!identityInfo.ssn || !identityInfo.driverLicense || !identityInfo.password) {
      setInformerMessage({
        message: "Please fill in all required fields",
        type: "error",
      })
      return
    }

    setLoading(true)

    // Simulate KYC verification
    setTimeout(() => {
      setKycStatus("verified")
      setLoading(false)
      nextStep()
    }, 3000)
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pinInfo.pin !== pinInfo.confirmPin) {
      setInformerMessage({
        message: "PINs don't match",
        type: "error",
      })
      return
    }

    if (pinInfo.pin.length !== 4) {
      setInformerMessage({
        message: "PIN must be 4 digits",
        type: "error",
      })
      return
    }

    setLoading(true)

    try {
      // Complete registration
      await register(personalInfo.firstName, personalInfo.lastName, personalInfo.email, identityInfo.password)

      setInformerMessage({
        message: "Account created successfully! Welcome to FidelityTrust!",
        type: "success",
      })

      setTimeout(() => {
        resetForm()
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      setInformerMessage({
        message: "Registration failed. Please try again.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-green-500 flex flex-col items-center justify-center p-4">
      {informerMessage && (
        <Informer
          message={informerMessage.message}
          type={informerMessage.type}
          onClose={() => setInformerMessage(null)}
        />
      )}

      <Link
        href="/"
        className="absolute top-4 left-4 text-white flex items-center hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-2xl bg-navy-800 border-white/10 text-white">
        <CardHeader className="space-y-6">
          <div className="flex justify-center items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center"></div>
            <span className="font-bold text-lg">
              <span className="text-green-500">Fidelity</span>
              <span className="text-white">Trust</span>
            </span>
          </div>

          <div className="space-y-4">
            <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Complete the steps below to set up your FidelityTrust account
            </CardDescription>

            <div className="space-y-4">
              <Progress value={progress} className="w-full" />

              <div className="flex justify-between">
                {steps.map((step) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.number
                  const isCompleted = currentStep > step.number

                  return (
                    <div key={step.number} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted
                            ? "bg-green-500 border-green-500"
                            : isActive
                              ? "border-emerald-400 bg-emerald-400/20"
                              : "border-gray-600 bg-gray-700"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <Icon className={`h-5 w-5 ${isActive ? "text-emerald-400" : "text-gray-400"}`} />
                        )}
                      </div>
                      <span className={`text-xs text-center ${isActive ? "text-emerald-400" : "text-gray-400"}`}>
                        {step.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ firstName: e.target.value })}
                        className="bg-navy-700 border-white/10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ lastName: e.target.value })}
                        className="bg-navy-700 border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ email: e.target.value })}
                      className="bg-navy-700 border-white/10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ phone: e.target.value })}
                      className="bg-navy-700 border-white/10"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo({ address: e.target.value })}
                      className="bg-navy-700 border-white/10"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={personalInfo.city}
                        onChange={(e) => setPersonalInfo({ city: e.target.value })}
                        className="bg-navy-700 border-white/10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={personalInfo.state} onValueChange={(value) => setPersonalInfo({ state: value })}>
                        <SelectTrigger className="bg-navy-700 border-white/10">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={personalInfo.zipCode}
                        onChange={(e) => setPersonalInfo({ zipCode: e.target.value })}
                        className="bg-navy-700 border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-navy-900">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleIdentitySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ssn">Social Security Number *</Label>
                    <Input
                      id="ssn"
                      type="password"
                      value={identityInfo.ssn}
                      onChange={(e) => setIdentityInfo({ ssn: e.target.value })}
                      className="bg-navy-700 border-white/10"
                      placeholder="XXX-XX-XXXX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driverLicense">Driver's License / State ID *</Label>
                    <Input
                      id="driverLicense"
                      value={identityInfo.driverLicense}
                      onChange={(e) => setIdentityInfo({ driverLicense: e.target.value })}
                      className="bg-navy-700 border-white/10"
                      required
                    />
                  </div>

                  {isLoading && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                      <p className="text-blue-400">Verifying your identity...</p>
                    </div>
                  )}

                  {kycStatus === "verified" && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                      <Check className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400">Identity verified successfully!</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={identityInfo.password}
                        onChange={(e) => setIdentityInfo({ password: e.target.value })}
                        className="bg-navy-700 border-white/10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={identityInfo.confirmPassword}
                      onChange={(e) => setIdentityInfo({ confirmPassword: e.target.value })}
                      className="bg-navy-700 border-white/10"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-navy-900"
                    >
                      {isLoading ? "Verifying..." : "Continue"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePinSubmit} className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Create Your Transaction PIN</h3>
                    <p className="text-gray-400 text-sm">
                      This 4-digit PIN will be used to authorize transactions and secure your account
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin">Create 4-Digit PIN *</Label>
                      <Input
                        id="pin"
                        type="password"
                        maxLength={4}
                        value={pinInfo.pin}
                        onChange={(e) => setPinInfo({ pin: e.target.value.replace(/\D/g, "") })}
                        className="bg-navy-700 border-white/10 text-center text-2xl tracking-widest"
                        placeholder="••••"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPin">Confirm PIN *</Label>
                      <Input
                        id="confirmPin"
                        type="password"
                        maxLength={4}
                        value={pinInfo.confirmPin}
                        onChange={(e) => setPinInfo({ confirmPin: e.target.value.replace(/\D/g, "") })}
                        className="bg-navy-700 border-white/10 text-center text-2xl tracking-widest"
                        placeholder="••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      <strong>Important:</strong> Keep your PIN secure and don't share it with anyone. You'll need this
                      PIN to authorize transactions.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-navy-900"
                    >
                      {isLoading ? "Creating Account..." : "Complete Registration"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

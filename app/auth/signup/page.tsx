"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Shield,
  User,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignupStore } from "@/lib/store/signup";
import { useAuthStore } from "@/lib/store/auth";
import { Informer } from "@/components/ui/informer";
import { RegistrationLoader } from "@/components/registration-loader";

const steps = [
  { number: 1, title: "Personal Information", icon: User },
  { number: 2, title: "Identity Verification", icon: Shield },
  { number: 3, title: "Security Setup", icon: Lock },
];

const states = [
  "Alabama (AL)",
  "Alaska (AK)",
  "Arizona (AZ)",
  "Arkansas (AR)",
  "California (CA)",
  "Colorado (CO)",
  "Connecticut (CT)",
  "Delaware (DE)",
  "Florida (FL)",
  "Georgia (GA)",
  "Hawaii (HI)",
  "Idaho (ID)",
  "Illinois (IL)",
  "Indiana (IN)",
  "Iowa (IA)",
  "Kansas (KS)",
  "Kentucky (KY)",
  "Louisiana (LA)",
  "Maine (ME)",
  "Maryland (MD)",
  "Massachusetts (MA)",
  "Michigan (MI)",
  "Minnesota (MN)",
  "Mississippi (MS)",
  "Missouri (MO)",
  "Montana (MT)",
  "Nebraska (NE)",
  "Nevada (NV)",
  "New Hampshire (NH)",
  "New Jersey (NJ)",
  "New Mexico (NM)",
  "New York (NY)",
  "North Carolina (NC)",
  "North Dakota (ND)",
  "Ohio (OH)",
  "Oklahoma (OK)",
  "Oregon (OR)",
  "Pennsylvania (PA)",
  "Rhode Island (RI)",
  "South Carolina (SC)",
  "South Dakota (SD)",
  "Tennessee (TN)",
  "Texas (TX)",
  "Utah (UT)",
  "Vermont (VT)",
  "Virginia (VA)",
  "Washington (WA)",
  "West Virginia (WV)",
  "Wisconsin (WI)",
  "Wyoming (WY)",
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [informerMessage, setInformerMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const [registrationMessage, setRegistrationMessage] = useState(
    "Initializing your account..."
  );
  const [showLoader, setShowLoader] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const {
    currentStep,
    personalInfo,
    identityInfo,
    pinInfo,
    isLoading,
    kycStatus,
    passwordStrength,
    setPersonalInfo,
    setIdentityInfo,
    setPinInfo,
    setLoading,
    setKycStatus,
    nextStep,
    prevStep,
    resetForm,
  } = useSignupStore();

  const { register } = useAuthStore();

  const progress = (currentStep / 3) * 100;

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    const missing = required.filter(
      (field) => !personalInfo[field as keyof typeof personalInfo]
    );

    if (missing.length > 0) {
      setInformerMessage({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    nextStep();
  };

  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!identityInfo.ssn || !identityInfo.driverLicense) {
      setInformerMessage({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    if (!identityInfo.password || !identityInfo.confirmPassword) {
      setInformerMessage({
        message: "Please enter and confirm your password",
        type: "error",
      });
      return;
    }

    if (identityInfo.password.length < 7) {
      setInformerMessage({
        message: "Password must be at least 7 characters long",
        type: "error",
      });
      return;
    }

    if (passwordStrength.score < 3) {
      setInformerMessage({
        message: "Please choose a stronger password",
        type: "error",
      });
      return;
    }

    if (identityInfo.password !== identityInfo.confirmPassword) {
      setInformerMessage({
        message: "Passwords don't match",
        type: "error",
      });
      return;
    }

    setLoading(true);

    // Simulate KYC verification
    setTimeout(() => {
      setKycStatus(true);
      setLoading(false);
      nextStep();
    }, 3000);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pinInfo.pin !== pinInfo.confirmPin) {
      setInformerMessage({
        message: "PINs don't match",
        type: "error",
      });
      return;
    }

    if (pinInfo.pin.length !== 4) {
      setInformerMessage({
        message: "PIN must be 4 digits",
        type: "error",
      });
      return;
    }

    setShowLoader(true);
    setRegistrationStatus("loading");
    setRegistrationProgress(0);
    setRegistrationMessage("Initializing your account...");
    setRetryCount(0);

    // Log the data being sent
    console.log("Registration Data:", {
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      password: identityInfo.password,
      pin: pinInfo.pin,
      personalInfo: {
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city,
        state: personalInfo.state,
        zipCode: personalInfo.zipCode,
        ssn: identityInfo.ssn, // Log SSN specifically
        driverLicense: identityInfo.driverLicense,
      },
    });

    const simulateProgress = () => {
      const interval = setInterval(() => {
        setRegistrationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      return interval;
    };

    const progressInterval = simulateProgress();

    const attemptRegistration = async () => {
      try {
        const registrationData = {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          password: identityInfo.password,
          pin: pinInfo.pin,
          personalInfo: {
            phone: personalInfo.phone,
            address: personalInfo.address,
            city: personalInfo.city,
            state: personalInfo.state,
            zipCode: personalInfo.zipCode,
            ssn: identityInfo.ssn,
            driverLicense: identityInfo.driverLicense,
          },
        };

        console.log(
          "Sending registration request with data:",
          registrationData
        );
        const response = await register(
          personalInfo.firstName,
          personalInfo.lastName,
          personalInfo.email,
          identityInfo.password,
          pinInfo.pin,
          {
            phone: personalInfo.phone,
            address: personalInfo.address,
            city: personalInfo.city,
            state: personalInfo.state,
            zipCode: personalInfo.zipCode,
            ssn: identityInfo.ssn,
            driverLicense: identityInfo.driverLicense,
          }
        );
        console.log("Registration response:", response);

        clearInterval(progressInterval);
        setRegistrationProgress(100);
        setRegistrationStatus("success");
        setRegistrationMessage("Account created successfully!");

        // Store the response in auth store
        const { setUser } = useAuthStore.getState();
        setUser(response.data.user);

        // Set the signup flow flag
        sessionStorage.setItem("showSignupFlow", "true");

        // Clear signup data after successful registration
        resetForm();

        // Comment out routing logic temporarily for debugging
        // router.push("/dashboard");
      } catch (error) {
        console.error("Registration error:", error);
        clearInterval(progressInterval);

        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          setRegistrationMessage(
            `Retrying registration (Attempt ${retryCount + 1}/${maxRetries})...`
          );
          setRegistrationProgress(0);
          simulateProgress();
          setTimeout(attemptRegistration, 2000);
        } else {
          setRegistrationStatus("error");
          setRegistrationMessage(
            "Failed to create account after multiple attempts."
          );
        }
      }
    };

    attemptRegistration();
  };

  const handleRetry = () => {
    setRetryCount(0);
    setRegistrationStatus("loading");
    setRegistrationProgress(0);
    setRegistrationMessage("Retrying registration...");
    handlePinSubmit(new Event("submit") as any);
  };

  const handleContinue = () => {
    resetForm();
    router.push("/dashboard");
  };

  if (showLoader) {
    return (
      <RegistrationLoader
        status={registrationStatus}
        progress={registrationProgress}
        message={registrationMessage}
        onRetry={handleRetry}
        onContinue={handleContinue}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {informerMessage && (
        <Informer
          message={informerMessage.message}
          type={informerMessage.type}
          onClose={() => setInformerMessage(null)}
        />
      )}

      <Link
        href="/"
        className="absolute top-6 left-6 text-white/80 flex items-center hover:text-white transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
        <CardHeader className="space-y-6">
          <div className="flex justify-center items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-emerald-400">Fidelity</span>
              <span className="text-white/90">Trust</span>
            </span>
          </div>

          <div className="space-y-4">
            <CardTitle className="text-2xl text-center font-semibold">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-white/60 text-center">
              Complete the steps below to set up your FidelityTrust account
            </CardDescription>

            <div className="space-y-4">
              <Progress value={progress} className="w-full h-2 bg-white/10" />

              <div className="flex justify-between">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;

                  return (
                    <div
                      key={step.number}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20"
                            : isActive
                            ? "border-emerald-400 bg-emerald-400/20 shadow-lg shadow-emerald-400/10"
                            : "border-white/20 bg-white/5"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <Icon
                            className={`h-6 w-6 ${
                              isActive ? "text-emerald-400" : "text-white/40"
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm text-center font-medium ${
                          isActive ? "text-emerald-400" : "text-white/40"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
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
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white/80">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) =>
                          setPersonalInfo({ firstName: e.target.value })
                        }
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white/80">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) =>
                          setPersonalInfo({ lastName: e.target.value })
                        }
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({ email: e.target.value })
                      }
                      className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/80">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        setPersonalInfo({ phone: e.target.value })
                      }
                      className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white/80">
                      Street Address *
                    </Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) =>
                        setPersonalInfo({ address: e.target.value })
                      }
                      className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                      placeholder="123 Main St, Apt 4B"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white/80">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={personalInfo.city}
                        onChange={(e) =>
                          setPersonalInfo({ city: e.target.value })
                        }
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white/80">
                        State *
                      </Label>
                      <Select
                        value={personalInfo.state}
                        onValueChange={(value) =>
                          setPersonalInfo({ state: value })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="bg-navy-800 border-white/10">
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-white/80">
                        ZIP Code *
                      </Label>
                      <Input
                        id="zipCode"
                        value={personalInfo.zipCode}
                        onChange={(e) =>
                          setPersonalInfo({ zipCode: e.target.value })
                        }
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  >
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
                <form onSubmit={handleIdentitySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ssn" className="text-white/80">
                      Social Security Number *
                    </Label>
                    <Input
                      id="ssn"
                      type="password"
                      value={identityInfo.ssn}
                      onChange={(e) => setIdentityInfo({ ssn: e.target.value })}
                      className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                      placeholder="XXX-XX-XXXX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driverLicense" className="text-white/80">
                      Driver's License / State ID No *
                    </Label>
                    <Input
                      id="driverLicense"
                      value={identityInfo.driverLicense}
                      onChange={(e) =>
                        setIdentityInfo({ driverLicense: e.target.value })
                      }
                      className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                      placeholder="DL12345678"
                      required
                    />
                  </div>

                  {isLoading && !kycStatus && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
                      <p className="text-blue-400 font-medium">
                        Verifying your identity...
                      </p>
                    </div>
                  )}

                  {kycStatus && !isLoading && (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6 text-center">
                      <Check className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                      <p className="text-emerald-400 font-medium">
                        Identity verified successfully!
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80">
                      Create Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={identityInfo.password}
                        onChange={(e) => {
                          setIdentityInfo({ password: e.target.value });
                        }}
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors pr-10"
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {identityInfo.password && (
                      <div className="space-y-2">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score <= 2
                                ? "bg-red-500"
                                : passwordStrength.score <= 3
                                ? "bg-yellow-500"
                                : passwordStrength.score <= 4
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${(passwordStrength.score / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <p
                          className={`text-sm ${
                            passwordStrength.score <= 2
                              ? "text-red-400"
                              : passwordStrength.score <= 3
                              ? "text-yellow-400"
                              : passwordStrength.score <= 4
                              ? "text-blue-400"
                              : "text-green-400"
                          }`}
                        >
                          {passwordStrength.message}
                        </p>
                        <ul className="text-xs text-white/60 space-y-1">
                          <li
                            className={
                              identityInfo.password.length >= 10
                                ? "text-emerald-400"
                                : ""
                            }
                          >
                            • At least 10 characters long
                          </li>
                          <li
                            className={
                              /[A-Z]/.test(identityInfo.password)
                                ? "text-emerald-400"
                                : ""
                            }
                          >
                            • Contains uppercase letter
                          </li>
                          <li
                            className={
                              /[a-z]/.test(identityInfo.password)
                                ? "text-emerald-400"
                                : ""
                            }
                          >
                            • Contains lowercase letter
                          </li>
                          <li
                            className={
                              /\d/.test(identityInfo.password)
                                ? "text-emerald-400"
                                : ""
                            }
                          >
                            • Contains number
                          </li>
                          <li
                            className={
                              /[!@#$%^&*(),.?":{}|<>]/.test(
                                identityInfo.password
                              )
                                ? "text-emerald-400"
                                : ""
                            }
                          >
                            • Contains special character
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/80">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={identityInfo.confirmPassword}
                      onChange={(e) =>
                        setIdentityInfo({ confirmPassword: e.target.value })
                      }
                      className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
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
                    <h3 className="text-lg font-semibold text-white/90">
                      Create Your Transaction PIN
                    </h3>
                    <p className="text-white/60 text-sm">
                      This 4-digit PIN will be used to authorize transactions
                      and secure your account
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin" className="text-white/80">
                        Create 4-Digit PIN *
                      </Label>
                      <Input
                        id="pin"
                        type="password"
                        maxLength={4}
                        value={pinInfo.pin}
                        onChange={(e) =>
                          setPinInfo({ pin: e.target.value.replace(/\D/g, "") })
                        }
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors text-center text-2xl tracking-widest"
                        placeholder="Enter 4 digits"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPin" className="text-white/80">
                        Confirm PIN *
                      </Label>
                      <Input
                        id="confirmPin"
                        type="password"
                        maxLength={4}
                        value={pinInfo.confirmPin}
                        onChange={(e) =>
                          setPinInfo({
                            confirmPin: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors text-center text-2xl tracking-widest"
                        placeholder="Confirm 4 digits"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
                    <p className="text-yellow-400 text-sm">
                      <strong>Important:</strong> Keep your PIN secure and don't
                      share it with anyone. You'll need this PIN to authorize
                      transactions.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 border-white/20 text-white bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Security Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-sm">
        <Shield className="h-4 w-4" />
        <span>Bank-Grade Security</span>
      </div>
    </div>
  );
}

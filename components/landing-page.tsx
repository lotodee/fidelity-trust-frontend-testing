import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  TrendingUp,
  Globe,
  CreditCard,
  Star,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-950 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-md">
            <span className="font-bold text-lg">
              <span className="text-white">Fidelity</span>
              <span className="text-white/70">Trust</span>
            </span>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="hover:text-white/80 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#security"
            className="hover:text-white/80 transition-colors"
          >
            Security
          </Link>
          <Link href="#about" className="hover:text-white/80 transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:text-white/80">
              Log In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-white text-navy-900 hover:bg-white/90 font-medium">
              Open Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Bank-Grade Security
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Your Financial Future, Secured
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-lg">
              Experience banking reimagined with advanced security, seamless
              transactions, and personalized financial solutions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-navy-900 hover:bg-white/90 font-medium"
                >
                  Open Account
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 transform rotate-6">
              <Image
                width={2000}
                height={2000}
                src="/phone3.png"
                alt="Mobile banking app"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Banking Features That Make Life Easier
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Discover a suite of powerful tools designed to simplify your
            financial life
          </p>
        </div>

        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl"></div>
          </div>

          {/* Feature Content */}
          <div className="relative">
            {/* Security */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <ShieldCheck className="h-5 w-5 text-white mr-2" />
                  <span className="text-sm font-medium">Advanced Security</span>
                </div>
                <h3 className="text-3xl font-bold">Bank-Grade Protection</h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Your security is our priority. Benefit from multi-factor
                  authentication, biometric security, and real-time fraud
                  monitoring.
                </p>
                <Link href="/auth/signup">
                  <Button className="bg-white text-navy-900 hover:bg-white/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl transform -rotate-3"></div>
                <div className="relative bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 p-4">
                    <div className="h-full flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"
                          >
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-white/30"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Cards */}
            <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <CreditCard className="h-5 w-5 text-white mr-2" />
                  <span className="text-sm font-medium">Virtual Cards</span>
                </div>
                <h3 className="text-3xl font-bold">Secure Digital Payments</h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Experience the future of payments with our virtual card
                  system. Create instant digital cards, set spending limits, and
                  freeze them anytime with a single tap.
                </p>
                <Link href="/auth/signup">
                  <Button className="bg-white text-navy-900 hover:bg-white/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="w-full max-w-sm p-6">
                      <div className="bg-white/10 rounded-xl p-4 mb-4">
                        <div className="h-8 w-16 bg-white/20 rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                          <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-24 bg-white/20 rounded"></div>
                        <div className="h-8 w-8 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <TrendingUp className="h-5 w-5 text-white mr-2" />
                  <span className="text-sm font-medium">Smart Analytics</span>
                </div>
                <h3 className="text-3xl font-bold">
                  Insightful Financial Tracking
                </h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Get detailed insights into your spending habits with our
                  advanced analytics. Visualize your financial patterns and make
                  informed decisions.
                </p>
                <Link href="/auth/signup">
                  <Button className="bg-white text-navy-900 hover:bg-white/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform -rotate-3"></div>
                <div className="relative bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4">
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-4 w-24 bg-white/20 rounded"></div>
                        <div className="h-4 w-16 bg-white/20 rounded"></div>
                      </div>
                      <div className="flex-1 grid grid-cols-7 gap-2 items-end">
                        {[30, 45, 60, 40, 75, 50, 65].map((height, i) => (
                          <div
                            key={i}
                            className="h-full flex flex-col justify-end"
                          >
                            <div
                              className="bg-white/30 rounded-t-sm transition-all duration-500 hover:bg-white/40"
                              style={{ height: `${height}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Transfers */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <Globe className="h-5 w-5 text-white mr-2" />
                  <span className="text-sm font-medium">Global Transfers</span>
                </div>
                <h3 className="text-3xl font-bold">Borderless Banking</h3>
                <p className="text-white/70 text-lg leading-relaxed">
                  Send money anywhere in the world instantly. Enjoy competitive
                  exchange rates and minimal fees with our global transfer
                  network.
                </p>
                <div className="flex items-center gap-4">
                  <Link href="/auth/signup">
                    <Button className="bg-white text-navy-900 hover:bg-white/90">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <span className="text-emerald-400 text-sm font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-pink-500/20 to-red-500/20 p-4">
                    <div className="h-full flex items-center justify-center">
                      <div className="relative w-full max-w-md">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border-2 border-white/20 animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-24 h-24 rounded-full border-2 border-white/30 animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-16 h-16 rounded-full border-2 border-white/40 animate-pulse"
                            style={{ animationDelay: "1s" }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About FidelityTrust
              </h2>
              <p className="text-white/70 mb-8">
                We're revolutionizing the banking experience by combining
                cutting-edge technology with traditional banking values. Our
                mission is to make financial services accessible, secure, and
                efficient for everyone.
              </p>
              <div className="space-y-4">
                {[
                  "Founded in 2015",
                  "Serving over 5 million customers",
                  "Available in 150+ countries",
                  "24/7 customer support",
                  "Industry-leading security",
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Our Vision</h3>
                      <p className="text-sm text-white/60">
                        To be the most trusted financial platform globally
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Our Promise</h3>
                      <p className="text-sm text-white/60">
                        Uncompromising security and reliability
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Our Growth</h3>
                      <p className="text-sm text-white/60">
                        Expanding services and reach
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="bg-white/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Bank-Grade Security
              </h2>
              <p className="text-white/70 mb-8">
                Your security is our top priority. We employ industry-leading
                security measures to protect your assets and personal
                information.
              </p>
              <div className="space-y-4">
                {[
                  "256-bit encryption",
                  "Multi-factor authentication",
                  "Biometric security",
                  "Real-time fraud monitoring",
                  "Secure data centers",
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Secure Transactions</h3>
                      <p className="text-sm text-white/60">
                        Every transaction is protected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Data Protection</h3>
                      <p className="text-sm text-white/60">
                        Your data is encrypted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Global Security</h3>
                      <p className="text-sm text-white/60">
                        Protected worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust FidelityTrust for
            their banking needs.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-white text-navy-900 hover:bg-white/90"
            >
              Open Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">FidelityTrust</span>
              </div>
              <p className="text-white/60 text-sm">
                Secure banking solutions for the digital age.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="hover:text-white">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-white">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
            © 2015 FidelityTrust. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="relative z-10">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-white/80">{description}</p>
        <div className="mt-6 flex items-center text-white/60 group-hover:text-white transition-colors">
          <span className="text-sm font-medium">Learn more</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingUp, Globe, CreditCard, Star } from "lucide-react";
import Image from "next/image";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-950 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
            {/* <span className="font-bold text-navy-900">FT</span> */}
          </div>
          <div className="bg-navy-900 px-3 py-1.5 rounded-md">
            <span className="font-bold text-lg">
              <span className="text-green-500">Fidelity</span>
              <span className="text-white">Trust</span>
            </span>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="hover:text-emerald-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#security"
            className="hover:text-emerald-400 transition-colors"
          >
            Security
          </Link>
          <Link
            href="#about"
            className="hover:text-emerald-400 transition-colors"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="text-white hover:text-emerald-400"
            >
              Log In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-navy-900 font-medium">
              Open Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Experience Awesome Banking Like Never Before
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-lg">
              Manage your spending, savings, investments, and overall financial
              life seamlessly in one convenient location.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-navy-900 font-medium"
                >
                  Open Account
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Learn More
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
                className=""
              />
            </div>
            {/* <div className="absolute top-20 -right-4 z-20 transform -rotate-6">
              <img
                src="/placeholder.svg?height=500&width=250"
                alt="Transaction history"
                className="rounded-3xl shadow-2xl"
              />
            </div> */}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold">175,923+</p>
            <p className="text-gray-400 mt-2">Satisfied customers</p>
          </div>
          <div>
            <div className="flex items-center justify-center">
              <p className="text-4xl font-bold">4.9</p>
              <Star className="h-6 w-6 ml-2 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-gray-400 mt-2">App rating</p>
          </div>
          <div>
            <p className="text-4xl font-bold">200+</p>
            <p className="text-gray-400 mt-2">Supported countries</p>
          </div>
        </div>
      </section>

      {/* Features */}
      {/* <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Banking Features That Make Life Easier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-emerald-500" />}
            title="Virtual Cards"
            description="Create and manage virtual cards for secure online transactions."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-emerald-500" />}
            title="Real-time Updates"
            description="Get instant notifications for all your transactions and account activities."
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10 text-emerald-500" />}
            title="Global Transfers"
            description="Send money worldwide with competitive exchange rates and low fees."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-10 w-10 text-emerald-500" />}
            title="Bank-grade Security"
            description="Your money and data are protected with advanced encryption and security protocols."
          />
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-navy-950 py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="font-bold text-navy-900 text-sm">N</span>
              </div>
              <span className="font-bold">FidelityTrust</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} FidelityTrust. All rights reserved.
            </div>
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-navy-800/50 p-8 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

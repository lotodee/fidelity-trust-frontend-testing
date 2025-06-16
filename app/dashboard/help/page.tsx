"use client";

import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Smartphone,
  Shield,
  CreditCard,
  Wallet,
  Lock,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";

const helpSections = [
  {
    title: "Getting Started",
    icon: Smartphone,
    items: [
      {
        question: "How do I download the Fidelity Trust Mobile App?",
        answer:
          "You can download our mobile app from the App Store (iOS) or Google Play Store (Android). Search for 'Fidelity Trust' and follow the installation instructions.",
      },
      {
        question: "How do I register for mobile banking?",
        answer:
          "To register, open the app and tap 'Register'. You'll need your account number, email address, and phone number. Follow the verification steps to complete your registration.",
      },
      {
        question: "What devices are supported?",
        answer:
          "Our mobile app supports iOS 13.0 and above, and Android 8.0 and above. We recommend using the latest version of your device's operating system for the best experience.",
      },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      {
        question: "How secure is mobile banking?",
        answer:
          "We use industry-standard encryption and security measures to protect your information. This includes biometric authentication, secure sessions, and real-time fraud monitoring.",
      },
      {
        question: "What should I do if I lose my phone?",
        answer:
          "Immediately contact our customer service at 1-800-123-4567. We can help you secure your account and guide you through the process of accessing your account from a new device.",
      },
      {
        question: "How do I set up biometric login?",
        answer:
          "Go to Settings > Security > Biometric Login. Follow the prompts to set up fingerprint or face recognition for quick and secure access to your account.",
      },
    ],
  },
  {
    title: "Banking Features",
    icon: CreditCard,
    items: [
      {
        question: "How do I transfer money?",
        answer:
          "Tap 'Transfer' in the main menu. You can transfer between your accounts, to other Fidelity Trust customers, or to external accounts. Follow the prompts to complete your transfer.",
      },
      {
        question: "Can I deposit checks using the app?",
        answer:
          "Yes! Use the 'Mobile Deposit' feature to take photos of your checks. Make sure to endorse the check and follow the on-screen instructions for proper capture.",
      },
      {
        question: "How do I view my transaction history?",
        answer:
          "Tap 'Transactions' in the main menu. You can filter by date, category, or amount. Export options are available for record-keeping.",
      },
    ],
  },
  {
    title: "Account Management",
    icon: Wallet,
    items: [
      {
        question: "How do I update my personal information?",
        answer:
          "Go to Profile > Personal Information. You can update your contact details, address, and other personal information. Some changes may require verification.",
      },
      {
        question: "How do I set up account alerts?",
        answer:
          "Navigate to Settings > Alerts. You can set up notifications for transactions, balance updates, security alerts, and more.",
      },
      {
        question: "Can I manage my cards in the app?",
        answer:
          "Yes! Go to Cards to view your cards, set spending limits, enable/disable international transactions, and report lost or stolen cards.",
      },
    ],
  },
];

export default function HelpCenter() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
            <p className="text-gray-500 mt-2">
              Find answers to common questions about Fidelity Trust Mobile
              Banking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <MessageSquare className="h-12 w-12 text-white/80 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Need More Help?</h3>
                  <p className="text-white/70 mb-6">
                    Our support team is available 24/7 to assist you with any
                    questions or concerns.
                  </p>
                  <a href="/dashboard/chat" className="w-full">
                    <button className="w-full bg-white text-emerald-600 hover:bg-white/90 py-2 px-4 rounded-lg">
                      Start Live Chat
                    </button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-navy-800 to-navy-950 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Mail className="h-12 w-12 text-white/80 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Email Us</h3>
                  <p className="text-white/70 mb-6">
                    Need to send us a message? Our support team will respond
                    within 24 hours.
                  </p>
                  <a href="mailto:Mail@fidelitytrust.org" className="w-full">
                    <button className="w-full border border-white/20 text-white hover:bg-white/10 py-2 px-4 rounded-lg">
                      Mail@fidelitytrust.org
                    </button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {helpSections.map((section, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader className="border-b pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <section.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>
                        Common questions about {section.title.toLowerCase()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, itemIndex) => (
                      <AccordionItem
                        key={itemIndex}
                        value={`item-${index}-${itemIndex}`}
                      >
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-600">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

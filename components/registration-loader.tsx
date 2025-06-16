import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface RegistrationLoaderProps {
  onRetry: () => void;
  onContinue: () => void;
  status: "loading" | "success" | "error";
  progress: number;
  message: string;
}

const funFacts = [
  "Did you know? FidelityTrust processes over 1 million transactions daily!",
  "Our security system uses 256-bit encryption to protect your data.",
  "You can send money to over 150 countries with FidelityTrust.",
  "Our mobile app has a 4.8/5 rating on both App Store and Play Store.",
  "We've helped over 5 million customers achieve their financial goals.",
  "Our customer support team responds within 2 minutes on average.",
  "FidelityTrust has been recognized as the most secure banking platform in 2023.",
  "You can earn up to 5% cashback on all your transactions.",
  "We offer 24/7 fraud monitoring to protect your account.",
  "Our AI-powered system can detect suspicious activities in real-time.",
  "We've processed over $50 billion in transactions since our launch.",
  "Our mobile app has been downloaded over 2 million times.",
  "We offer instant transfers to over 200 banks worldwide.",
  "Our customer satisfaction rate is 98%.",
  "We've helped customers save over $100 million in fees.",
  "Our platform is available in 12 languages.",
  "We offer competitive interest rates on savings accounts.",
  "Our investment platform has over 10,000 stocks and ETFs.",
  "We provide free financial education resources.",
  "Our app has won multiple design awards.",
];

const securitySteps = [
  {
    title: "Creating your account",
    description: "Setting up your personal space",
    detail: "We're creating a secure environment for your financial journey",
  },
  {
    title: "Securing your data",
    description: "Implementing bank-grade encryption",
    detail: "Your information is being protected with military-grade security",
  },
  {
    title: "Setting up your wallet",
    description: "Preparing your digital assets",
    detail: "Initializing your secure digital wallet with advanced features",
  },
  {
    title: "Establishing connections",
    description: "Creating secure channels",
    detail: "Building encrypted pathways for your transactions",
  },
  {
    title: "Configuring limits",
    description: "Setting up transaction boundaries",
    detail: "Customizing security parameters for your account",
  },
  {
    title: "Enabling protection",
    description: "Activating fraud monitoring",
    detail: "Setting up real-time monitoring for your account security",
  },
  {
    title: "Initializing backup",
    description: "Securing your information",
    detail: "Creating redundant security measures for your data",
  },
  {
    title: "Finalizing setup",
    description: "Completing your account",
    detail: "Performing final security checks and optimizations",
  },
  {
    title: "Optimizing performance",
    description: "Fine-tuning your experience",
    detail: "Ensuring the fastest and most reliable service",
  },
  {
    title: "Preparing dashboard",
    description: "Setting up your control center",
    detail: "Customizing your financial management interface",
  },
  {
    title: "Enabling features",
    description: "Activating premium services",
    detail: "Unlocking advanced banking capabilities",
  },
  {
    title: "Testing systems",
    description: "Verifying functionality",
    detail: "Running comprehensive security and performance checks",
  },
  {
    title: "Setup Complete",
    description: "Your account is ready",
    detail:
      "Welcome to FidelityTrust! Your account has been successfully created",
  },
];

const tips = [
  "Pro tip: Enable two-factor authentication for extra security",
  "Did you know? You can set up recurring payments to save time",
  "Tip: Use our mobile app for quick access to your account",
  "Pro tip: Set up account alerts to monitor your transactions",
  "Did you know? You can earn rewards on your everyday purchases",
  "Tip: Use our budgeting tools to track your spending",
  "Pro tip: Set up automatic savings to grow your wealth",
  "Did you know? You can invest in stocks directly from your account",
  "Tip: Use our currency converter for international transfers",
  "Pro tip: Enable biometric login for faster access",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export function RegistrationLoader({
  onRetry,
  onContinue,
  status,
  progress,
  message,
}: RegistrationLoaderProps) {
  const [currentFact, setCurrentFact] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (status === "success") {
      setCurrentStep(securitySteps.length - 1); // Show "Setup Complete" step
    } else {
      const factInterval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % funFacts.length);
      }, 8000);

      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % (securitySteps.length - 1));
      }, 4000);

      const tipInterval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 6000);

      

      router.push("/dashboard")
      return () => {
        clearInterval(factInterval);
        clearInterval(stepInterval);
        clearInterval(tipInterval);
      };
    }
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex items-center justify-center p-4 z-50"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl relative"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold mb-2"
            >
              Setting Up Your Account
            </motion.h2>
            <motion.p variants={itemVariants} className="text-white/60">
              {message}
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{status === "success" ? "100" : progress}%</span>
              </div>
              <Progress
                value={status === "success" ? 100 : progress}
                className="h-2"
              />
            </div>

            <div className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="bg-white/5 rounded-xl p-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent" />
                <h3 className="text-sm font-medium mb-2">Current Step</h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <p className="text-emerald-400 font-medium">
                      {securitySteps[currentStep].title}
                    </p>
                    <p className="text-white/80 text-sm">
                      {securitySteps[currentStep].description}
                    </p>
                    <p className="text-white/60 text-xs">
                      {securitySteps[currentStep].detail}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/5 rounded-xl p-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
                <h3 className="text-sm font-medium mb-2">Did You Know?</h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentFact}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white/80"
                  >
                    {funFacts[currentFact]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white/5 rounded-xl p-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent" />
                <h3 className="text-sm font-medium mb-2">Pro Tips</h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white/80"
                  >
                    {tips[currentTip]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {status === "loading" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="inline-block">
                    <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                </motion.div>
              )}

              {/* {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Ready to Begin Your Journey?
                    </h3>
                    <p className="text-white/60 mb-6">
                      Your account is all set up! Let's get you started with
                      your new FidelityTrust experience.
                    </p>
                    <Button
                      onClick={onContinue}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Continue to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )} */}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center"
                  >
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Something Went Wrong
                    </h3>
                    <p className="text-white/60 mb-6">
                      We encountered an issue while setting up your account.
                      Please try again later or contact our support team.
                    </p>
                    <Button
                      onClick={onRetry}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

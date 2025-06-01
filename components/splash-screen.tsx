"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white overflow-hidden">
      <div className="relative flex flex-col items-center max-w-2xl mx-auto px-4">
        {/* Logo Container */}
        <div className="relative flex items-center justify-center mb-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -left-16 -top-16"
          >
            <Shield className="h-32 w-32 text-white/10" />
          </motion.div>
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-bold text-white"
            >
              Fidelity
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-bold text-white/70"
            >
              Trust
            </motion.div>
          </div>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-xl md:text-2xl text-white/70 text-center mb-12 font-light"
        >
          Secure Banking for a Digital World
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-64 h-1 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-white"
          />
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 text-sm text-white/50 flex items-center gap-2"
        >
          <Shield className="h-4 w-4 text-white/50" />
          <span>Bank-Grade Security</span>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-col items-center max-w-4xl mx-auto px-6">
        {/* Main Content Container */}
        <div className="relative flex flex-col items-center">
          {/* Logo and Brand */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            <div className="relative flex flex-col items-center">
              {/* Logo Container */}
              <div className="relative mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative w-32 h-32"
                >
                  <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10" />
                  <div className="absolute inset-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-white/90" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Lock className="h-8 w-8 text-white/90" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Brand Name */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
                  <span className="text-white">Fidelity</span>
                  <span className="text-white/70">Trust</span>
                </h1>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl text-white/60 font-light tracking-wide"
                >
                  Secure Banking for a Digital World
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="relative h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.4, duration: 2.5, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400/80 via-emerald-300/80 to-white"
              />
            </motion.div>
          </div>
        </div>

        {/* Security Badge */}
        {/* <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <Shield className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-white/70 font-medium">
            256-bit Encryption
          </span>
        </motion.div> */}
      </div>
    </div>
  );
}

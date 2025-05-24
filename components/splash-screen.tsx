"use client"

import { motion } from "framer-motion"

export function SplashScreen() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-navy-900 text-white overflow-hidden">
      <div className="relative flex items-center">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-green-500"
        >
      Fidelity
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold text-white"
        >
          Trust
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-2 w-full h-1 bg-emerald-500"
        />
      </div>
    </div>
  )
}

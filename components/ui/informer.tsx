"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InformerProps {
  message: string | {};
  type?: "success" | "error" | "info" | "warning" | "security";
  duration?: number;
  onClose?: () => void;
  title?: string;
  showProgress?: boolean;
}

export function Informer({
  message,
  type = "info",
  duration = 2000,
  onClose,
  title,
  showProgress = true,
}: InformerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 10);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    security: "bg-purple-50 border-purple-200 text-purple-800",
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    security: <Shield className="h-5 w-5 text-purple-500" />,
  };

  const getIconBackground = () => {
    switch (type) {
      case "success":
        return "bg-emerald-100";
      case "error":
        return "bg-red-100";
      case "info":
        return "bg-blue-100";
      case "warning":
        return "bg-yellow-100";
      case "security":
        return "bg-purple-100";
      default:
        return "bg-blue-100";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
          />

          {/* Centered Informer */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-0 z-[100] flex items-center justify-center top-0 px-4"
          >
            <div
              className={cn(
                "relative w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl shadow-lg border",
                styles[type]
              )}
            >
              {/* Icon */}
              <div className="flex items-start gap-4 px-6 py-5">
                <div
                  className={cn(
                    "flex-shrink-0 p-2 rounded-lg",
                    getIconBackground()
                  )}
                >
                  {icons[type]}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  {title && (
                    <h3 className="font-semibold text-base mb-1">{title}</h3>
                  )}
                  <div className="text-sm break-words">{message as string}</div>

                  {/* Progress */}
                  {showProgress && (
                    <div className="mt-3 h-1 w-full bg-black/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                        className={cn("h-full rounded-full", {
                          "bg-emerald-500": type === "success",
                          "bg-red-500": type === "error",
                          "bg-blue-500": type === "info",
                          "bg-yellow-500": type === "warning",
                          "bg-purple-500": type === "security",
                        })}
                      />
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                  }}
                  className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

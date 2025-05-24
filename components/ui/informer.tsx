// "use client";

// import { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface InformerProps {
//   message: string;
//   type?: "success" | "error" | "info";
//   duration?: number;
//   onClose?: () => void;
// }

// export function Informer({
//   message,
//   type = "info",
//   duration = 3000,
//   onClose,
// }: InformerProps) {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(false);
//       onClose?.();
//     }, duration);

//     return () => clearTimeout(timer);
//   }, [duration, onClose]);

//   if (!isVisible) return null;

//   const styles = {
//     success: "bg-emerald-500 text-white border-emerald-600",
//     error: "bg-red-500 text-white border-red-600",
//     info: "bg-blue-500 text-white border-blue-600",
//   };

//   return (
//     <>
//       {/* Overlay */}
//       <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" />

//       {/* Informer */}
//       <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300 w-full">
//         <div
//           className={cn(
//             "flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border",
//             styles[type]
//           )}
//         >
//           <div className="flex-1 text-center font-medium">{message}</div>
//           <button
//             onClick={() => {
//               setIsVisible(false);
//               onClose?.();
//             }}
//             className="p-1 hover:bg-white/20 rounded-full transition-colors"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface InformerProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Informer({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: InformerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: "bg-emerald-500 text-white border-emerald-600",
    error: "bg-red-500 text-white border-red-600",
    info: "bg-blue-500 text-white border-blue-600",
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" />

      {/* Informer */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300 px-4 w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div
          className={cn(
            "flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg border",
            styles[type]
          )}
        >
          <div className="flex-1 text-center text-sm sm:text-base font-medium break-words">
            {message}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

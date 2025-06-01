import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-gray-200",
          sizeClasses[size]
        )}
      >
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-emerald-500 border-r-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}

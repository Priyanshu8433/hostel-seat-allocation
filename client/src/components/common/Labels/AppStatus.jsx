import { cn } from "@/lib/utils";
import React from "react";

const variants = {
  approved: "bg-green-500/50",
  pending: "bg-yellow-500/50",
  rejected: "bg-destructive/40",
};

const AppStatus = ({ variant, text, className }) => {
  return (
    <div
      className={cn(
        "bg-secondary rounded-full py-1 text-sm",
        variants[variant],
        className
      )}
    >
      {String(text).charAt(0).toUpperCase() + String(text).slice(1)}
    </div>
  );
};

export default AppStatus;

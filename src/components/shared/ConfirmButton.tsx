"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConfirmButtonProps {
  onConfirm: () => void;
  defaultText: string;
  confirmText: string;
  baseClassName: string;
  confirmClassName?: string;
  disabled?: boolean;
}

export function ConfirmButton({
  onConfirm,
  defaultText,
  confirmText,
  baseClassName,
  confirmClassName = "!bg-red-500 !text-white !border-red-500",
  disabled = false,
}: ConfirmButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => setIsConfirming(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirming]);

  const handleClick = () => {
    if (isConfirming) {
      onConfirm();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        baseClassName,
        isConfirming && confirmClassName,
        "transition-all duration-300",
      )}
    >
      {isConfirming ? confirmText : defaultText}
    </button>
  );
}

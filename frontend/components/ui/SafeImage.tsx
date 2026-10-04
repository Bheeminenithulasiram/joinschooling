"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackInitials?: string;
  fallbackClassName?: string;
  loading?: "lazy" | "eager";
}

export function SafeImage({
  src,
  alt,
  className = "",
  fallbackInitials,
  fallbackClassName = "",
  loading = "lazy",
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    if (fallbackInitials) {
      return (
        <div
          className={`flex items-center justify-center font-bold text-slate-700 bg-slate-100 ${fallbackClassName || className}`}
          aria-label={alt}
        >
          <span>{fallbackInitials}</span>
        </div>
      );
    }
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${fallbackClassName || className}`}
        aria-label={alt}
      >
        <Building2 size={24} className="opacity-60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
    />
  );
}

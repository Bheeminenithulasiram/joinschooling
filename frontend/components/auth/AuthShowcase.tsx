"use client";
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function AuthShowcase() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dynamic college and campus images directly from the PostgreSQL database via API
  useEffect(() => {
    async function loadDatabaseShowcase() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://joinschooling-api-heot.onrender.com";
        const res = await fetch(`${apiUrl}/api/v1/auth/showcase`, {
          next: { revalidate: 120 },
        });
        if (res.ok) {
          const data = await res.json();
          const dbImages: string[] = [];

          // 1. Extract from images array returned by backend database query
          if (data.images && Array.isArray(data.images)) {
            data.images.forEach((img: string) => {
              if (img && typeof img === "string" && !dbImages.includes(img)) {
                dbImages.push(img);
              }
            });
          }

          // 2. Extract from college database entities
          if (data.colleges && Array.isArray(data.colleges)) {
            data.colleges.forEach((college: any) => {
              if (college.banner_url && !dbImages.includes(college.banner_url)) {
                dbImages.push(college.banner_url);
              }
            });
          }

          if (dbImages.length > 0) {
            setImages(dbImages);
          }
        }
      } catch (err) {
        console.warn("Could not fetch showcase from database:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDatabaseShowcase();
  }, []);

  // Auto-play horizontal sliding animation (4.5s)
  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, images.length]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageError = (failedSrc: string) => {
    setImages((prev) => prev.filter((src) => src !== failedSrc));
  };

  if (isLoading && images.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-xl items-center justify-center overflow-hidden rounded-3xl bg-slate-100 shadow-xl border border-slate-200/80 aspect-[16/10] sm:aspect-[16/10] lg:h-[480px]">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Loader2 size={24} className="animate-spin text-brand-600" />
          <span className="text-xs font-medium">Loading campus gallery from database…</span>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-200/80 transition-all duration-300 aspect-[16/10] sm:aspect-[16/10] lg:h-[480px]"
    >
      {/* Dynamic Sliding Track: Animated horizontal transitions */}
      <div
        className="flex h-full w-full transition-transform duration-600 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div
            key={src + index}
            className="relative h-full w-full min-w-full shrink-0 overflow-hidden bg-slate-950 flex items-center justify-center"
          >
            <img
              src={src}
              alt={`Campus showcase ${index + 1}`}
              className="h-full w-full object-cover object-center select-none"
              loading={index === 0 ? "eager" : "lazy"}
              onError={() => handleImageError(src)}
            />
          </div>
        ))}
      </div>

      {/* Subtle vignette gradient at bottom so indicator dots stand out */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-20" />

      {/* Navigation Arrows (Translucent with hover effects) */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-80 sm:opacity-0 transition-all duration-200 hover:bg-black/70 hover:scale-110 group-hover:opacity-100 active:scale-95 shadow-lg"
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-80 sm:opacity-0 transition-all duration-200 hover:bg-black/70 hover:scale-110 group-hover:opacity-100 active:scale-95 shadow-lg"
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>

      {/* Navigation Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-7 bg-white shadow-md"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

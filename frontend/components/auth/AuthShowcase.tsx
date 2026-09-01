"use client";
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_CAMPUS_IMAGES = [
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1600&auto=format&fit=crop",
];

export default function AuthShowcase() {
  const [images, setImages] = useState<string[]>(DEFAULT_CAMPUS_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dynamic college and campus images from PostgreSQL database
  useEffect(() => {
    async function loadImages() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://joinschooling-api-heot.onrender.com";
        const res = await fetch(`${apiUrl}/api/v1/auth/showcase`, {
          next: { revalidate: 300 },
        });
        if (res.ok) {
          const json = await res.json();
          const cleanImages: string[] = [];
          if (json.images && json.images.length > 0) {
            json.images.forEach((img: string) => {
              if (img && !img.includes("1503676260728") && !cleanImages.includes(img)) {
                cleanImages.push(img);
              }
            });
          }
          if (cleanImages.length > 0) {
            setImages(cleanImages);
          }
        }
      } catch (err) {
        console.warn("Auth showcase loaded with curated campus images:", err);
      }
    }
    loadImages();
  }, []);

  // Auto-play slideshow with smooth horizontal sliding
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

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-200/80 transition-all duration-300 aspect-[4/3] sm:aspect-[16/11] lg:h-[500px]"
    >
      {/* Sliding Track for Smooth Horizontal Slide Transition */}
      <div
        className="flex h-full w-full transition-transform duration-600 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div
            key={src + index}
            className="relative h-full w-full min-w-full shrink-0 overflow-hidden bg-slate-950"
          >
            <img
              src={src}
              alt={`College campus architecture ${index + 1}`}
              className="h-full w-full object-cover object-center select-none"
              loading={index === 0 ? "eager" : "lazy"}
              onError={() => handleImageError(src)}
            />
          </div>
        ))}
      </div>

      {/* Subtle bottom gradient to ensure navigation indicators remain clearly visible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-20" />

      {/* Navigation Arrows with smooth hover transitions */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-75 sm:opacity-0 transition-all duration-200 hover:bg-black/70 hover:scale-110 group-hover:opacity-100 active:scale-95 shadow-lg"
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-75 sm:opacity-0 transition-all duration-200 hover:bg-black/70 hover:scale-110 group-hover:opacity-100 active:scale-95 shadow-lg"
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>

      {/* Navigation Dots Indicator */}
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

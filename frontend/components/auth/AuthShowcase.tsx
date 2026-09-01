"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&h=900&fit=crop",
];

export default function AuthShowcase() {
  const [images, setImages] = useState<string[]>(DEFAULT_FALLBACK_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
          if (json.images && json.images.length > 0) {
            setImages(json.images);
          } else if (json.colleges && json.colleges.length > 0) {
            const extracted = json.colleges
              .map((c: any) => c.banner_url)
              .filter(Boolean);
            if (extracted.length > 0) {
              setImages(extracted);
            }
          }
        }
      } catch (err) {
        console.warn("Auth showcase loaded with fallback images:", err);
      }
    }
    loadImages();
  }, []);

  // Auto-play slideshow every 4 seconds
  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl bg-slate-100 shadow-2xl border border-slate-200/80 transition-all duration-300 aspect-[4/3] sm:aspect-[16/11] lg:h-[520px]"
    >
      {/* Slideshow Images Container */}
      <div className="relative h-full w-full overflow-hidden">
        {images.map((src, index) => (
          <div
            key={src + index}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 pointer-events-none scale-105"
            } transition-transform duration-1000`}
          >
            <img
              src={src}
              alt={`JoinSchooling showcase image ${index + 1}`}
              className="h-full w-full object-cover select-none"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Subtle bottom vignette gradient for contrast of indicator dots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-20" />
      </div>

      {/* Navigation Arrows (Visible on hover) */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md opacity-0 transition-all duration-200 hover:bg-black/55 group-hover:opacity-100 active:scale-95"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md opacity-0 transition-all duration-200 hover:bg-black/55 group-hover:opacity-100 active:scale-95"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
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
                ? "w-6 bg-white shadow-md"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

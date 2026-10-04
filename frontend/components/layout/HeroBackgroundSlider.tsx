"use client";

import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop", // Campus tower & lawn
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1920&auto=format&fit=crop", // Modern university building
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop", // Historic library / campus
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop", // College campus hall
  "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=1920&auto=format&fit=crop", // Tech park / innovation center
];

export function HeroBackgroundSlider({ initialImages }: { initialImages?: string[] }) {
  const images = initialImages && initialImages.length > 0 ? initialImages : HERO_IMAGES;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {images.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-25" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out"
          />
        </div>
      ))}

      {/* Deep Gradient Overlays to seamlessly blend into #0a1324 theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1324]/90 via-[#0a1324]/80 to-[#0a1324]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.22),transparent)]" />
    </div>
  );
}

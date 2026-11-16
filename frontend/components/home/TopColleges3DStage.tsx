"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
} from "lucide-react";

export interface College3D {
  id: string;
  rank: number;
  name: string;
  city: string;
  state: string;
  disciplines: string[];
  accreditation: string;
  rating: string;
  reviews: string;
  avgCtc: string;
  highestCtc: string;
  cutoff: string;
  monogram: string;
  image: string;
  slug: string;
}

const DEFAULT_COLLEGES: College3D[] = [
  {
    id: "iitb",
    rank: 1,
    name: "IIT Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    disciplines: ["Engineering"],
    accreditation: "NIRF #1 • IoE",
    rating: "4.9",
    reviews: "12k+",
    avgCtc: "₹23.5 LPA",
    highestCtc: "₹1.68 Cr",
    cutoff: "JEE Adv AIR 68",
    monogram: "IITB",
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=900&q=85",
    slug: "iit-bombay",
  },
  {
    id: "iith",
    rank: 2,
    name: "IIT Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    disciplines: ["Engineering"],
    accreditation: "NIRF #8 • IoE",
    rating: "4.9",
    reviews: "8.4k+",
    avgCtc: "₹22.5 LPA",
    highestCtc: "₹65.4 LPA",
    cutoff: "JEE Adv AIR 608",
    monogram: "IITH",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=85",
    slug: "iit-hyderabad",
  },
  {
    id: "bits",
    rank: 3,
    name: "BITS Pilani, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    disciplines: ["Engineering"],
    accreditation: "NAAC A++ • Deemed",
    rating: "4.8",
    reviews: "7.1k+",
    avgCtc: "₹20.1 LPA",
    highestCtc: "₹60.7 LPA",
    cutoff: "BITSAT 298+",
    monogram: "BITS",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=85",
    slug: "bits-pilani-hyderabad",
  },
  {
    id: "vnr",
    rank: 4,
    name: "VNR VJIET",
    city: "Hyderabad",
    state: "Telangana",
    disciplines: ["Engineering"],
    accreditation: "NAAC A++ • Autonomous",
    rating: "4.8",
    reviews: "8k+",
    avgCtc: "₹10.2 LPA",
    highestCtc: "₹48.0 LPA",
    cutoff: "TG EAPCET 2,400",
    monogram: "VNR",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85",
    slug: "vnr-vjiet",
  },
  {
    id: "isb",
    rank: 5,
    name: "ISB Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    disciplines: ["Management"],
    accreditation: "Triple Crown • AACSB",
    rating: "4.9",
    reviews: "5.2k+",
    avgCtc: "₹34.2 LPA",
    highestCtc: "₹72.0 LPA",
    cutoff: "GMAT 710+ / GRE",
    monogram: "ISB",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85",
    slug: "isb-hyderabad",
  },
  {
    id: "gitam",
    rank: 6,
    name: "GITAM University",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    disciplines: ["Engineering", "Management"],
    accreditation: "NAAC A++ • UGC Cat-I",
    rating: "4.7",
    reviews: "6k+",
    avgCtc: "₹9.4 LPA",
    highestCtc: "₹46.5 LPA",
    cutoff: "GAT 88%ile",
    monogram: "GITAM",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=900&q=85",
    slug: "gitam-university",
  },
  {
    id: "bvrit",
    rank: 7,
    name: "BVRIT Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    disciplines: ["Engineering"],
    accreditation: "NAAC A+ • NBA",
    rating: "4.6",
    reviews: "4k+",
    avgCtc: "₹8.6 LPA",
    highestCtc: "₹44.0 LPA",
    cutoff: "TG EAPCET 4,200",
    monogram: "BVRIT",
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=900&q=85",
    slug: "bvrit-hyderabad",
  },
];

function getContinuousSignedOffset(slotIdx: number, pos: number, total: number) {
  let diff = (slotIdx - pos) % total;
  if (diff < 0) diff += total;
  if (diff > total / 2) diff -= total;
  return diff;
}

export function TopColleges3DStage({ colleges = DEFAULT_COLLEGES }: { colleges?: College3D[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [isAutoFlow, setIsAutoFlow] = useState<boolean>(true);

  // Filtered List
  const activeColleges = useMemo(() => {
    if (filter === "all") return colleges;
    return colleges.filter((c) => c.disciplines.includes(filter));
  }, [colleges, filter]);

  // Virtual nodes for seamless continuous wrapping across full screen
  const virtualNodes = useMemo(() => {
    const minNodes = 9;
    const repeats = Math.max(1, Math.ceil(minNodes / activeColleges.length));
    const nodes: { college: College3D; originalIndex: number }[] = [];
    for (let r = 0; r < repeats; r++) {
      activeColleges.forEach((c, idx) => {
        nodes.push({ college: c, originalIndex: idx });
      });
    }
    return nodes;
  }, [activeColleges]);

  // Physics & Animation Refs
  const trackPositionRef = useRef<number>(0);
  const targetPositionRef = useRef<number | null>(0);
  const isHoveringRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartPosRef = useRef<number>(0);

  // Dynamic 3D Cursor Tilt State
  const tiltRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    sheenX: 50,
    sheenY: 35,
    isHovering: false,
  });

  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLElement | null)[]>([]);

  // Reset positions on filter change
  useEffect(() => {
    trackPositionRef.current = 0;
    targetPositionRef.current = 0;
  }, [filter]);

  // Main 60fps Animation Loop
  useEffect(() => {
    let animId: number;

    const animate = () => {
      const total = virtualNodes.length;
      if (total === 0) {
        animId = requestAnimationFrame(animate);
        return;
      }

      // Smooth glide to target position when set
      if (targetPositionRef.current !== null && !isDraggingRef.current) {
        const diff = targetPositionRef.current - trackPositionRef.current;
        trackPositionRef.current += diff * 0.12;

        if (Math.abs(diff) < 0.001) {
          trackPositionRef.current = targetPositionRef.current;
          targetPositionRef.current = null;
        }
      } else if (isAutoFlow && !isHoveringRef.current && !isDraggingRef.current) {
        // Continuous slow orbit ONLY when NOT hovered and NOT dragging
        trackPositionRef.current += 0.0032;
      }

      // Smooth tilt easing
      tiltRef.current.currentX += (tiltRef.current.targetX - tiltRef.current.currentX) * 0.14;
      tiltRef.current.currentY += (tiltRef.current.targetY - tiltRef.current.currentY) * 0.14;

      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const isTablet = typeof window !== "undefined" && window.innerWidth < 1024;
      const xSpacing = isMobile ? 220 : isTablet ? 280 : 330;

      // Update 3D card transforms
      cardElementsRef.current.forEach((cardEl, i) => {
        if (!cardEl) return;

        const offset = getContinuousSignedOffset(i, trackPositionRef.current, total);
        const absOffset = Math.abs(offset);

        const translateX = offset * xSpacing;
        const translateZ = -Math.pow(absOffset, 1.15) * 110;
        const rotateY = Math.max(-38, Math.min(38, offset * -18));
        const scale = Math.max(0.72, 1 - absOffset * 0.095);

        // Visible cards are 100% solid and opaque (NO washed-out translucent white glow)
        // Cards past the visible viewport are cleanly hidden
        const opacity = absOffset > 2.25 ? 0 : 1;

        const isFrontCenter = absOffset < 0.35;
        const zIndex = Math.round(100 - absOffset * 15);

        // Controlled, stable tilt so buttons never move under the user's cursor
        const extraTiltX = isFrontCenter ? Math.max(-3, Math.min(3, tiltRef.current.currentX * 0.25)) : 0;
        const extraTiltY = isFrontCenter ? Math.max(-5, Math.min(5, tiltRef.current.currentY * 0.3)) : 0;
        const extraTiltZ = isFrontCenter && isHoveringRef.current ? 12 : 0;

        cardEl.style.transform = `translate(-50%, -50%) translate3d(${translateX.toFixed(
          2
        )}px, 0px, ${(translateZ + extraTiltZ).toFixed(2)}px) rotateX(${extraTiltX.toFixed(
          2
        )}deg) rotateY(${(rotateY + extraTiltY).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        cardEl.style.opacity = String(opacity);
        cardEl.style.zIndex = String(zIndex);
        cardEl.style.pointerEvents = opacity === 1 ? "auto" : "none";

        if (isFrontCenter) {
          cardEl.classList.add("is-center");
          cardEl.style.setProperty("--sheen-x", `${tiltRef.current.sheenX.toFixed(1)}%`);
          cardEl.style.setProperty("--sheen-y", `${tiltRef.current.sheenY.toFixed(1)}%`);

          if (isHoveringRef.current) {
            cardEl.classList.add("is-drawer-open");
          } else {
            cardEl.classList.remove("is-drawer-open");
          }
        } else {
          cardEl.classList.remove("is-center");
          cardEl.classList.remove("is-drawer-open");
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [virtualNodes.length, isAutoFlow]);

  // Step Carousel manually (Prev / Next)
  const manualOrbit = useCallback((step: number) => {
    const base =
      targetPositionRef.current !== null
        ? targetPositionRef.current
        : Math.round(trackPositionRef.current);
    targetPositionRef.current = base + step;
  }, []);

  // Jump to specific card by slot
  const handleCardClick = (slotIdx: number, slug: string) => {
    const total = virtualNodes.length;
    const offset = getContinuousSignedOffset(slotIdx, trackPositionRef.current, total);
    if (Math.abs(offset) > 0.35) {
      // Orbit clicked card smoothly into center
      targetPositionRef.current = Math.round(trackPositionRef.current + offset);
    }
  };

  // Gentle Mouse Move Tilt & Sheen on Center Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardsContainerRef.current) return;
    const rect = cardsContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Gentle tilt clamping so elements stay stable
    tiltRef.current.targetY = Math.max(-10, Math.min(10, normX * 10));
    tiltRef.current.targetX = Math.max(-8, Math.min(8, -normY * 8));
    tiltRef.current.sheenX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    tiltRef.current.sheenY = Math.max(0, Math.min(100, (y / rect.height) * 100));
  };

  // Hovering on the stage or cards STOPS auto-flow immediately and snaps to center
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    tiltRef.current.isHovering = true;
    // Snap and lock to the current nearest card so it never drifts away
    targetPositionRef.current = Math.round(trackPositionRef.current);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    tiltRef.current.isHovering = false;
    tiltRef.current.targetX = 0;
    tiltRef.current.targetY = 0;
  };

  // Pointer / Touch Drag Support: only when user drags are operations performed
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = trackPositionRef.current;
    targetPositionRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    const xSpacing = isMobile ? 230 : isTablet ? 290 : 335;
    trackPositionRef.current = dragStartPosRef.current - deltaX / xSpacing;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    // Snap cleanly to nearest card slot
    targetPositionRef.current = Math.round(trackPositionRef.current);
  };

  return (
    <section className="w-full py-10 select-none overflow-hidden">
      {/* Header Row: Title, Filters & Controls (Inside standard page container for alignment) */}
      <div className="container-page w-full mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-blue-600 rounded-full" />
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-blue-600">
                Accredited Rankings
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold tracking-tight text-slate-900 leading-tight">
              Top Accredited <span className="text-blue-600">Colleges &amp; Universities</span>
            </h2>
          </div>

          {/* Filter Pills beside View All Colleges Button */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Discipline Filter Pills */}
            <div className="inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Campuses
              </button>
              <button
                type="button"
                onClick={() => setFilter("Engineering")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === "Engineering"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Engineering
              </button>
              <button
                type="button"
                onClick={() => setFilter("Management")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === "Management"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Management
              </button>
            </div>

            {/* View All Colleges Button right beside the filter */}
            <Link
              href="/colleges"
              prefetch={true}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xs shrink-0"
            >
              <span>View All Colleges</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Prev / Next Arrows in the corner directly above the cards */}
        <div className="flex justify-end mt-3 sm:mt-2">
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => manualOrbit(-1)}
              aria-label="Previous college"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => manualOrbit(1)}
              aria-label="Next college"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Perspective Stage Viewport (Full width edge-to-edge, NO box container, NO edge glow) */}
      <div
        ref={cardsContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-[500px] sm:h-[530px] w-full overflow-hidden touch-pan-y"
      >
        {/* 3D Viewport Track */}
        <div className="stage-3d-viewport relative w-full h-full">
          {virtualNodes.map(({ college }, slotIdx) => {
            return (
              <article
                key={`${college.id}-${slotIdx}`}
                ref={(el) => {
                  cardElementsRef.current[slotIdx] = el;
                }}
                onClick={() => handleCardClick(slotIdx, college.slug)}
                className="stage-3d-card rounded-[1.6rem] bg-white border border-slate-200/90 overflow-hidden cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {/* College Cover Image (Clean: Compare and NIRF removed) */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="campus-cover-img w-full h-full object-cover object-center transition-transform duration-700 ease-out pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />
                </div>

                {/* College Details Card Body */}
                <div className="p-4 sm:p-5 relative bg-white">
                  <div className="flex items-end justify-between -mt-9 mb-2.5 relative z-10">
                    {/* Monogram Crest */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-md flex items-center justify-center font-black text-xs text-blue-600">
                      {college.monogram}
                    </div>

                    {/* Rank & Rating Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/70">
                      <span className="text-amber-500 font-extrabold">#{college.rank}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{college.rating}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({college.reviews})
                      </span>
                    </div>
                  </div>

                  <h4 className="font-display text-base font-extrabold text-slate-900 truncate">
                    {college.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate font-medium">
                    {college.city}, {college.state}
                  </p>

                  {/* Expandable Stats Drawer (Opens smoothly on Center Active Card, never shrinks while cursor is on button) */}
                  <div className="stats-drawer-3d">
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <div className="text-[9px] uppercase font-bold text-slate-400">
                          Avg CTC
                        </div>
                        <div className="font-black text-slate-900 mt-0.5 text-xs">
                          {college.avgCtc}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <div className="text-[9px] uppercase font-bold text-slate-400">
                          Highest
                        </div>
                        <div className="font-black text-emerald-600 mt-0.5 text-xs">
                          {college.highestCtc}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <div className="text-[9px] uppercase font-bold text-slate-400">
                          Cutoff
                        </div>
                        <div
                          className="font-black text-blue-600 mt-0.5 text-[10px] truncate"
                          title={college.cutoff}
                        >
                          {college.cutoff}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/colleges/${college.slug}`}
                        prefetch={true}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs hover:shadow-md cursor-pointer"
                      >
                        <span>Explore Campus</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

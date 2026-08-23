"use client";

import { useRef } from "react";
import Image from "next/image";
import { Room } from "@/types";
import { getRoomTypeImage } from "@/lib/images";
import { formatPrice } from "@/lib/money";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface RoomHeroProps {
  room: Room;
}

export function RoomHero({ room }: RoomHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const reducedMotion = useReducedMotion();
  const imageSrc = getRoomTypeImage(room.room_type.name);
  const formattedBaht = formatPrice(room.room_type.base_price);

  useGSAP(() => {
    if (reducedMotion || !containerRef.current) return;

    const mm = gsap.matchMedia();

    // Scene setup
    gsap.set(imageRef.current, { scale: 1.12 });
    gsap.set(overlayRef.current, { opacity: 0 });
    
    if (contentRef.current) {
      const elements = contentRef.current.children;
      gsap.set(elements, { opacity: 0, y: 30 });
    }

    // Initial cinematic load sequence
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(imageRef.current, { scale: 1, duration: 2.5 })
      .to(overlayRef.current, { opacity: 1, duration: 2 }, "-=2.5");

    if (contentRef.current) {
      const elements = contentRef.current.children;
      // Eyebrow
      tl.to(elements[0], { opacity: 1, y: 0, duration: 1 }, "-=1.5")
      // Title
      .to(elements[1], { opacity: 1, y: 0, duration: 1.2 }, "-=0.8")
      // Description
      .to(elements[2], { opacity: 1, y: 0, duration: 1 }, "-=0.9")
      // Price & Meta
      .to(elements[3], { opacity: 1, y: 0, duration: 1 }, "-=0.8");
    }

    // Scroll motion: slow exit (gets left behind)
    mm.add("(min-width: 768px)", () => {
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        yPercent: 30,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0.8, // Darken slightly as it exits
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, { scope: containerRef, dependencies: [reducedMotion] });

  return (
    <section 
      ref={containerRef}
      className="relative h-[90vh] md:h-[100vh] w-full flex items-center justify-center overflow-hidden bg-zinc-950 z-0"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-[115%] -top-[5%] relative">
          <Image
            ref={imageRef}
            src={imageSrc}
            alt={room.room_type.name}
            fill
            sizes="100vw"
            priority
            className="object-cover" 
          />
        </div>
        <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/20 to-zinc-950/80" />
      </div>
      
      <div 
        ref={contentRef}
        className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-16 md:pt-24"
      >
        <p className="text-xs font-semibold tracking-[0.4em] text-amber-500 uppercase mb-5 drop-shadow-sm">
          Room {room.room_number}
        </p>
        
        <h1 className="font-heading text-5xl md:text-7xl lg:text-[6rem] font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg mb-8">
          {room.room_type.name.toUpperCase()}
        </h1>

        <p className="text-zinc-200 text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow-md">
          {room.room_type.description || `A private retreat designed for space, stillness, and comfort.`}
        </p>
        
        <div className="flex flex-col items-center justify-center">
          <p className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
            THB {formattedBaht} <span className="text-base font-light text-zinc-300">/ night</span>
          </p>
          <div className="flex flex-wrap items-center justify-center text-sm text-zinc-300 gap-x-5 gap-y-2 uppercase tracking-[0.2em] font-medium drop-shadow-sm">
            <span>{room.room_type.max_guests} Guests</span>
            <span className="text-amber-500/70">•</span>
            <span>{room.room_type.bed_type}</span>
            <span className="text-amber-500/70">•</span>
            <span>{room.room_type.room_size} m²</span>
          </div>
        </div>
      </div>
    </section>
  );
}

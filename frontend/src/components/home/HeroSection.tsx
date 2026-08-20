"use client";

import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  hotelName: string;
  description: string;
}

export function HeroSection({ hotelName, description }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      // --- Background scale-in on load ---
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.06 },
          { scale: 1, duration: 3.5, ease: "power2.out" }
        );
      }

      // --- Staggered text entrance ---
      const textEls = [eyebrowRef.current, titleRef.current, descRef.current, ctaRef.current].filter(Boolean);
      gsap.fromTo(
        textEls,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          delay: 0.4,
          ease: "power3.out",
        }
      );

      // --- Subtle scroll parallax on background (desktop only) ---
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (!bgRef.current || !sectionRef.current) return;
        gsap.to(bgRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[600px] flex flex-col justify-end overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-zinc-950">
        <div ref={bgRef} className="relative w-full h-[115%] -top-[7%]">
          <Image
            src={HOTEL_IMAGES.hero}
            alt="Aurora Grand Hotel Exterior"
            fill
            className="object-cover object-[75%_center]"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Dark gradient overlays for text readability without muddying the whole image */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950/90 via-zinc-950/30 to-transparent md:w-2/3" />

      {/* Content - Editorial left-aligned */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-32">
        <div className="max-w-2xl">
          <p
            ref={eyebrowRef}
            className="text-sm md:text-base font-medium tracking-[0.3em] text-amber-300/90 uppercase mb-4"
          >
            Stay Beyond the Ordinary
          </p>

          <h1
            ref={titleRef}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-6 drop-shadow-xl"
          >
            {hotelName}
          </h1>

          <p
            ref={descRef}
            className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg drop-shadow-md"
          >
            {description}
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-amber-600 text-white hover:bg-amber-500 px-10 py-7 text-sm rounded-none tracking-[0.2em] uppercase shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Book Your Stay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white px-10 py-7 text-sm rounded-none tracking-[0.2em] uppercase transition-all duration-300"
            >
              Explore Rooms
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

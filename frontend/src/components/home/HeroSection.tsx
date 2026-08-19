"use client";

import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroSectionProps {
  hotelName: string;
  description: string;
}

export function HeroSection({ hotelName, description }: HeroSectionProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle slow scale-in for the hero background on load
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion && bgRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.1 },
          { scale: 1, duration: 4, ease: "power2.out" }
        );
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-end overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0 bg-zinc-950">
        <AnimatedReveal parallaxSpeed={2} className="w-full h-full">
          <div ref={bgRef} className="relative w-full h-[120%] -top-[10%]">
            <Image
              src={HOTEL_IMAGES.hero}
              alt="Aurora Grand Hotel Exterior"
              fill
              quality={95}
              className="object-cover object-[75%_center]"
              sizes="100vw"
              priority
            />
          </div>
        </AnimatedReveal>
      </div>

      {/* Dark gradient overlays for text readability without muddying the whole image */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950/90 via-zinc-950/30 to-transparent md:w-2/3" />

      {/* Content - Editorial left-aligned */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-32">
        <div className="max-w-2xl">
          <AnimatedReveal animation="fade-up" delay={0.2} duration={1.2}>
            <p className="text-sm md:text-base font-medium tracking-[0.3em] text-amber-300/90 uppercase mb-4">
              Stay Beyond the Ordinary
            </p>
          </AnimatedReveal>
          
          <AnimatedReveal animation="fade-up" delay={0.4} duration={1.2}>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-6 drop-shadow-xl">
              {hotelName}
            </h1>
          </AnimatedReveal>

          <AnimatedReveal animation="fade-up" delay={0.6} duration={1.2}>
            <p className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg drop-shadow-md">
              {description}
            </p>
          </AnimatedReveal>

          <AnimatedReveal animation="fade-up" delay={0.8} duration={1.2}>
            <div className="flex flex-col sm:flex-row gap-4">
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
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

export function RoomsHero() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <ParallaxImage speed={5} className="w-full h-[115%] -mt-[7%] relative">
          <Image
            src={HOTEL_IMAGES.hero}
            alt="Rooms and Suites"
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-60"
          />
        </ParallaxImage>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-50" />
      </div>
      
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-20">
        <Reveal animation="fade-up">
          <p className="text-sm font-semibold tracking-[0.3em] text-amber-500 uppercase mb-4">
            Rooms & Suites
          </p>
        </Reveal>
        
        <Reveal animation="fade-up" delay={0.15}>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
            Spaces designed for rest, privacy, and perspective.
          </h1>
        </Reveal>
      </div>
    </section>
  );
}

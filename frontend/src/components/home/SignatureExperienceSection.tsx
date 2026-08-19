"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";

export function SignatureExperienceSection() {
  return (
    <section className="relative w-full min-h-screen bg-zinc-950 flex items-center py-24 overflow-hidden">
      
      {/* Background Parallax Image */}
      <div className="absolute inset-0 z-0 opacity-40">
        <AnimatedReveal parallaxSpeed={2} className="w-full h-full">
          <div className="relative w-full h-[120%] -top-[10%]">
            <Image
              src={HOTEL_IMAGES.signature}
              alt="Aurora Signature Experience"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </AnimatedReveal>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-10 w-full">
        <div className="max-w-xl space-y-8">
          <AnimatedReveal animation="fade-up">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-amber-500 uppercase mb-4">
              Signature Experience
            </h2>
            <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Where time slows down.
            </h3>
          </AnimatedReveal>

          <AnimatedReveal animation="fade-up" delay={0.2}>
            <p className="text-zinc-300 text-lg font-light leading-relaxed">
              Begin your day with ocean-view mornings and private dining on your balcony. 
              Our signature hospitality ensures that your stay is not just an accommodation, but a curated journey of relaxation and architectural comfort.
            </p>
          </AnimatedReveal>
          
          <AnimatedReveal animation="fade-up" delay={0.4} className="pt-8">
            <button className="text-sm uppercase tracking-[0.2em] font-medium text-white pb-2 border-b border-amber-500 hover:text-amber-500 transition-colors">
              Discover Our Services
            </button>
          </AnimatedReveal>
        </div>
      </div>
      
    </section>
  );
}

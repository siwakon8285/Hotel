"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

export function BookingCTASection() {
  return (
    <section className="relative py-32 bg-zinc-950 flex items-center justify-center text-center overflow-hidden">

      {/* Background Image with subtle parallax */}
      <div className="absolute inset-0 z-0">
        <ParallaxImage speed={6} className="w-full h-[115%] -mt-[7%] relative">
          <Image
            src={HOTEL_IMAGES.bookingCta}
            alt="Book your stay"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </ParallaxImage>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-8">
        <Reveal animation="fade-up">
          <p className="text-sm font-semibold tracking-[0.3em] text-amber-500 uppercase">
            Your stay begins here
          </p>
        </Reveal>

        <Reveal animation="fade-up" delay={0.15}>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            Experience Aurora Grand Hotel.
          </h2>
        </Reveal>

        <Reveal animation="fade-up" delay={0.3}>
          <div className="pt-8">
            <Button
              size="lg"
              className="bg-white text-zinc-950 hover:bg-zinc-200 px-12 py-8 text-sm md:text-base rounded-none tracking-[0.2em] uppercase shadow-2xl transition-transform hover:scale-105 duration-300"
            >
              Book Your Stay
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

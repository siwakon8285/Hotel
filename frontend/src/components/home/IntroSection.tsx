"use client";

import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

export function IntroSection() {
  return (
    <section className="py-24 md:py-32 bg-zinc-50 text-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Text Content */}
          <div className="space-y-8 max-w-xl">
            <Reveal animation="fade-up">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-tight">
                A refined destination designed for modern luxury.
              </h2>
            </Reveal>

            <Reveal animation="fade-up" delay={0.15}>
              <p className="text-zinc-600 text-lg leading-relaxed font-light">
                Nestled at the edge of the horizon, Aurora Grand Hotel blends contemporary architecture with timeless hospitality.
                Experience a sanctuary where every detail is meticulously crafted to provide an unforgettable stay.
              </p>
            </Reveal>

            {/* Visual Statistics */}
            <StaggerGroup
              className="pt-8 grid grid-cols-3 gap-8 border-t border-zinc-200"
              stagger={0.12}
              distance={20}
            >
              <div>
                <p className="font-heading text-3xl font-bold text-zinc-900 mb-1">8</p>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium">Floors</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-zinc-900 mb-1">50</p>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium">Rooms</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-bold text-zinc-900 mb-1">5</p>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-medium">Room Types</p>
              </div>
            </StaggerGroup>
          </div>

          {/* Supporting Image with editorial reveal */}
          <ImageReveal
            direction="bottom"
            className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-200"
          >
            <Image
              src={HOTEL_IMAGES.intro}
              alt="Aurora Grand Hotel Architecture"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
          </ImageReveal>

        </div>
      </div>
    </section>
  );
}

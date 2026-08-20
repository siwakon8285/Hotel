"use client";

import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";

export function GallerySection() {
  return (
    <section className="py-24 md:py-32 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <Reveal animation="fade-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
              The Hotel in Details
            </h2>
          </Reveal>
        </div>

        {/* Asymmetrical Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">

          {/* Large Main Image — editorial clip reveal */}
          <ImageReveal
            direction="left"
            className="md:col-span-8 relative aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden bg-zinc-200"
          >
            <Image
              src={HOTEL_IMAGES.gallery.main}
              alt="Hotel Interior"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
          </ImageReveal>

          {/* Right Column Stack */}
          <div className="md:col-span-4 flex flex-col gap-6 md:gap-10">
            <Reveal
              animation="fade-up"
              delay={0.15}
            >
              <div className="relative aspect-square md:h-[280px] overflow-hidden bg-zinc-200">
                <Image
                  src={HOTEL_IMAGES.gallery.detail1}
                  alt="Hotel Details"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </Reveal>
            <Reveal
              animation="fade-up"
              delay={0.3}
            >
              <div className="relative aspect-square md:h-[280px] overflow-hidden bg-zinc-200">
                <Image
                  src={HOTEL_IMAGES.gallery.detail2}
                  alt="Hotel Dining"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

const stories = [
  {
    eyebrow: "Dawn",
    title: "Ocean Mornings",
    description:
      "Wake to the sound of waves and golden light flooding your room. Begin each day with a private sunrise breakfast on your balcony, overlooking an endless horizon.",
  },
  {
    eyebrow: "Taste",
    title: "Curated Dining",
    description:
      "From farm-to-table tasting menus to moonlit poolside cocktails, every meal is a journey. Our chefs craft seasonal dishes that celebrate local flavors with international finesse.",
  },
  {
    eyebrow: "Stillness",
    title: "Quiet Luxury",
    description:
      "True luxury is the absence of noise. Retreat to our spa, lose yourself in the infinity pool, or simply let time slow down in the warmth of your private suite.",
  },
  {
    eyebrow: "Care",
    title: "Personal Service",
    description:
      "Our signature hospitality anticipates your every need. A dedicated concierge, personalized touches, and attentive service ensure your stay is effortless and unforgettable.",
  },
];

export function SignatureExperienceSection() {
  return (
    <section className="bg-zinc-950 text-white overflow-hidden">
      {/* Mobile: normal stacked flow */}
      {/* Desktop (lg+): sticky image on left, scrolling text on right */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="pt-24 md:pt-32 pb-16 md:pb-20">
          <Reveal animation="fade-up">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-amber-500 uppercase mb-4">
              Signature Experience
            </h2>
            <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-2xl">
              Where time slows down.
            </h3>
          </Reveal>
        </div>

        <div className="lg:flex lg:gap-16 pb-24 md:pb-32">

          {/* Sticky Image Column (desktop only) */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="sticky top-24 pb-8">
              <ParallaxImage speed={4} className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={HOTEL_IMAGES.signature}
                  alt="Aurora Signature Experience"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
              </ParallaxImage>
            </div>
          </div>

          {/* Mobile Image (shown only on mobile/tablet) */}
          <div className="lg:hidden mb-12">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={HOTEL_IMAGES.signature}
                alt="Aurora Signature Experience"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
            </div>
          </div>

          {/* Scrolling Story Blocks */}
          <div className="lg:w-1/2 space-y-20 md:space-y-28 lg:space-y-32">
            {stories.map((story, i) => (
              <Reveal key={i} animation="fade-up" delay={0.05}>
                <div className="max-w-lg">
                  <p className="text-xs font-semibold tracking-[0.3em] text-amber-500/80 uppercase mb-4">
                    {story.eyebrow}
                  </p>
                  <h4 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                    {story.title}
                  </h4>
                  <p className="text-zinc-400 text-lg font-light leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <Reveal animation="fade-up">
            <button className="text-sm uppercase tracking-[0.2em] font-medium text-white pb-2 border-b border-amber-500 hover:text-amber-500 transition-colors">
              Discover Our Services
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

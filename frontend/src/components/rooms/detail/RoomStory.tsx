"use client";

import { useRef } from "react";
import Image from "next/image";
import { Room } from "@/types";
import { getRoomGallery, HOTEL_IMAGES } from "@/lib/images";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MaskedTextReveal } from "@/components/motion/MaskedTextReveal";

gsap.registerPlugin(ScrollTrigger);

interface RoomStoryProps {
  room: Room;
}

export function RoomStory({ room }: RoomStoryProps) {
  const { room_type } = room;
  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const isSuite = room_type.name.toLowerCase().includes("suite");
  const gallery = getRoomGallery(room_type.name);
  const storyImageSrc = gallery[2] || HOTEL_IMAGES.signature || HOTEL_IMAGES.hero;
  
  useGSAP(() => {
    if (reducedMotion || !containerRef.current || !leftColRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Pin the left headline column while right column scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false,
      });

      // Subtle parallax on the right column image
      const rightImg = rightColRef.current?.querySelector("img");
      if (rightImg) {
        gsap.to(rightImg, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    });

    return () => mm.revert();
  }, { scope: containerRef, dependencies: [reducedMotion] });

  return (
    <section ref={containerRef} className="relative z-10 bg-white border-t border-zinc-100">
      
      {/* Desktop Sticky Layout */}
      <div className="hidden lg:flex w-full max-w-[1440px] mx-auto min-h-[150vh] px-12 py-32 relative">
        {/* Left Sticky Column */}
        <div ref={leftColRef} className="w-1/2 h-screen flex flex-col justify-center pr-16 pb-32">
          <div className="w-12 h-[1px] bg-amber-600 mb-8" />
          <h2 className="font-heading text-6xl xl:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight">
            {isSuite ? (
              <>
                <MaskedTextReveal delay={0}>A room made</MaskedTextReveal>
                <MaskedTextReveal delay={0.1}>for slower</MaskedTextReveal>
                <MaskedTextReveal delay={0.2} className="text-zinc-400">mornings.</MaskedTextReveal>
              </>
            ) : (
              <>
                <MaskedTextReveal delay={0}>Designed</MaskedTextReveal>
                <MaskedTextReveal delay={0.1}>around your</MaskedTextReveal>
                <MaskedTextReveal delay={0.2} className="text-zinc-400">comfort.</MaskedTextReveal>
              </>
            )}
          </h2>
        </div>

        {/* Right Scrolling Column */}
        <div ref={rightColRef} className="w-1/2 pt-[30vh] pb-32 flex flex-col gap-24">
          <div className="text-2xl text-zinc-600 font-light leading-relaxed max-w-lg">
            {room_type.description || "Experience a space where every detail has been considered. Natural light, premium materials, and a sense of calm provide the perfect setting for your stay."}
          </div>
          
          <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-zinc-900">
              <Image
                src={storyImageSrc}
                alt={`${room_type.name} detail`}
                fill
                sizes="50vw"
                className="object-cover opacity-90 scale-110" // scale for parallax movement
              />
            </div>
          </div>

          <div className="text-lg text-zinc-500 font-light leading-relaxed max-w-md ml-auto border-l border-zinc-200 pl-8">
            Our signature {room_type.name.toLowerCase()} offers an uncompromising approach to luxury. Space to think, space to breathe, space to just be.
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Flow Layout */}
      <div className="lg:hidden w-full px-6 py-24 flex flex-col gap-12">
        <div>
          <div className="w-8 h-[1px] bg-amber-600 mb-6" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-8">
            {isSuite ? "A room made for slower mornings." : "Designed around your comfort."}
          </h2>
          <p className="text-xl text-zinc-600 font-light leading-relaxed">
            {room_type.description || "Experience a space where every detail has been considered. Natural light, premium materials, and a sense of calm provide the perfect setting for your stay."}
          </p>
        </div>
        
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
          <Image
            src={storyImageSrc}
            alt={`${room_type.name} detail`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

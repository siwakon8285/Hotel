"use client";

import { useRef } from "react";
import Image from "next/image";
import { getRoomGallery } from "@/lib/images";
import { Room } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface RoomGalleryProps {
  room: Room;
}

export function RoomGallery({ room }: RoomGalleryProps) {
  const gallery = getRoomGallery(room.room_type.name);
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !containerRef.current || gallery.length < 2) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const slides = gsap.utils.toArray<HTMLElement>(".gallery-slide");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // 200% of viewport height = 2 extra slides
          scrub: 1,
          pin: true,
        }
      });

      // Slide 1 is already visible. 
      // Animate Slide 2 in
      if (slides[1]) {
        tl.fromTo(slides[1], 
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }
        );
      }
      
      // Animate Slide 3 in
      if (slides[2]) {
        tl.fromTo(slides[2], 
          { clipPath: "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }
        );
      }
    });

    return () => mm.revert();
  }, { scope: containerRef, dependencies: [gallery.length, reducedMotion] });

  if (!gallery || gallery.length === 0) return null;

  // Fallback / Mobile View (Reduced Motion or < 1024px)
  return (
    <section ref={containerRef} className="relative bg-zinc-950 z-10 w-full overflow-hidden">
      
      {/* Desktop Sticky View */}
      <div className="hidden lg:block w-full h-screen relative">
        {gallery.map((src, index) => (
          <div 
            key={index} 
            className="gallery-slide absolute inset-0 w-full h-full"
            style={{ zIndex: index + 1 }}
          >
            <Image
              src={src}
              alt={`${room.room_type.name} gallery ${index + 1}`}
              fill
              sizes="100vw"
              className="object-cover opacity-90"
            />
            {/* Optional Overlay / Typography per slide */}
            <div className="absolute bottom-16 right-16 text-white text-right z-20">
              <p className="text-xs tracking-[0.4em] uppercase text-amber-500 mb-2">Scene 0{index + 3}</p>
              <h3 className="text-3xl font-heading font-bold drop-shadow-md">
                {index === 0 && "Architecture"}
                {index === 1 && "Details"}
                {index === 2 && "Comfort"}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet Scroll View */}
      <div className="lg:hidden w-full py-24 px-6 space-y-12 bg-white">
        <div>
          <h2 className="text-xs uppercase tracking-[0.4em] font-semibold text-amber-500 mb-8">
            Gallery
          </h2>
        </div>
        {gallery.map((src, index) => (
          <div key={index} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={src}
              alt={`${room.room_type.name} gallery ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

    </section>
  );
}

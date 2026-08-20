"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Wifi, Waves, Coffee, MonitorPlay, Bath, Wind } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const amenities = [
  { icon: Waves, title: "Ocean View", description: "Breathtaking panoramic views of the sea." },
  { icon: Bath, title: "Luxury Bath", description: "Deep soaking tubs and premium toiletries." },
  { icon: Coffee, title: "Room Service", description: "24/7 in-room dining from our signature restaurant." },
  { icon: Wifi, title: "High-Speed Wi-Fi", description: "Stay connected with complimentary gigabit internet." },
  { icon: MonitorPlay, title: "Smart TV", description: "65-inch displays with casting capabilities." },
  { icon: Wind, title: "Climate Control", description: "Personalized intelligent room climate systems." },
];

export function WhyStaySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !trackRef.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop, isTablet } = context.conditions!;
          const track = trackRef.current!;
          const section = sectionRef.current!;

          // Calculate the horizontal distance to travel
          const trackWidth = track.scrollWidth;
          const viewportWidth = section.offsetWidth;
          const distance = trackWidth - viewportWidth;

          if (distance <= 0) return; // Nothing to scroll

          // Scroll distance multiplier — controls how long the pin lasts
          // Desktop needs more room, mobile less
          const scrollMultiplier = isDesktop ? 1.2 : isTablet ? 1.0 : 0.85;

          // Horizontal track movement
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance * scrollMultiplier}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          tl.to(track, {
            x: -distance,
            ease: "none",
          });

          // Subtle heading counter-parallax
          if (headingRef.current) {
            tl.to(
              headingRef.current,
              {
                x: isDesktop ? 40 : 20,
                ease: "none",
              },
              0
            );
          }
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  // When reduced motion is active, render a compact grid fallback
  if (reducedMotion) {
    return (
      <section className="py-24 md:py-32 bg-white text-zinc-900 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-amber-600 uppercase mb-4">
              Hotel Amenities
            </h2>
            <h3 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Designed for Comfort
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {amenities.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                  <item.icon strokeWidth={1.5} className="w-6 h-6" />
                </div>
                <h4 className="font-heading text-lg font-semibold">{item.title}</h4>
                <p className="text-zinc-500 font-light text-sm leading-relaxed max-w-[200px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-20 bg-white text-zinc-900 border-t border-zinc-100">
      {/* Inner wrapper that gets pinned — stable viewport height for cinematic feel */}
      <div
        ref={sectionRef}
        className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      >

        {/* Section Heading — positioned above the track */}
        <div
          ref={headingRef}
          className="px-6 md:px-10 mb-10 md:mb-16 max-w-7xl mx-auto w-full"
        >
          <h2 className="text-sm font-semibold tracking-[0.2em] text-amber-600 uppercase mb-4">
            Hotel Amenities
          </h2>
          <h3 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Designed for Comfort
          </h3>
        </div>

        {/* Horizontal scrolling track */}
        <div
          ref={trackRef}
          className="flex items-start gap-8 md:gap-12 lg:gap-16 pl-6 md:pl-10 pr-[30vw] md:pr-[20vw]"
        >
          {amenities.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[75vw] sm:w-[55vw] md:w-[40vw] lg:w-[28vw] group"
            >
              <div className="space-y-5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors duration-300 text-zinc-400">
                  <item.icon strokeWidth={1.5} className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h4 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
                  {item.title}
                </h4>
                <p className="text-zinc-500 font-light text-base md:text-lg leading-relaxed max-w-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

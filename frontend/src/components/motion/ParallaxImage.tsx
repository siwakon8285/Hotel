"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  children: React.ReactNode;
  className?: string;
  /** Percentage of vertical movement (positive = downward). Default 8. */
  speed?: number;
}

/**
 * Wraps an image in a subtle vertical parallax driven by scroll.
 * Disabled completely under reduced-motion and on mobile (<768px) via matchMedia.
 */
export function ParallaxImage({
  children,
  className = "",
  speed = 8,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          containerRef.current,
          { yPercent: -speed / 2 },
          {
            yPercent: speed / 2,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [speed, reducedMotion] }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

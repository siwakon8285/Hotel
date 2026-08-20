"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Direction the clip-path mask opens from. */
  direction?: "bottom" | "left" | "right";
  delay?: number;
  duration?: number;
}

/**
 * Editorial image reveal using clip-path mask with a subtle inner scale.
 * Reduced-motion: content is immediately visible with no mask.
 */
export function ImageReveal({
  children,
  className = "",
  direction = "bottom",
  delay = 0,
  duration = 1.2,
}: ImageRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !wrapperRef.current) return;

      const el = wrapperRef.current;

      // Determine clip-path values based on direction
      let fromClip: string;
      const toClip = "inset(0% 0% 0% 0%)";

      switch (direction) {
        case "left":
          fromClip = "inset(0% 100% 0% 0%)";
          break;
        case "right":
          fromClip = "inset(0% 0% 0% 100%)";
          break;
        case "bottom":
        default:
          fromClip = "inset(100% 0% 0% 0%)";
          break;
      }

      gsap.fromTo(
        el,
        { clipPath: fromClip, scale: 1.06 },
        {
          clipPath: toClip,
          scale: 1,
          duration,
          delay,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: wrapperRef, dependencies: [direction, delay, duration, reducedMotion] }
  );

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}

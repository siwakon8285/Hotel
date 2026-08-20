"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type RevealAnimation = "fade-up" | "fade-in" | "scale-up";

interface RevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  className?: string;
  /** HTML tag to render. Defaults to "div". */
  as?: keyof HTMLElementTagNameMap;
}

/**
 * Scroll-triggered reveal component.
 * Reduced-motion: renders children immediately with no animation state.
 */
export function Reveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.9,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const el = containerRef.current;

      const scrollTrigger = {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none" as const,
      };

      if (animation === "fade-up") {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration, delay, ease: "power3.out", scrollTrigger }
        );
      } else if (animation === "fade-in") {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration, delay, ease: "power2.out", scrollTrigger }
        );
      } else if (animation === "scale-up") {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: duration * 1.2, delay, ease: "power3.out", scrollTrigger }
        );
      }
    },
    { scope: containerRef, dependencies: [animation, delay, duration, reducedMotion] }
  );

  return (
    // @ts-expect-error - dynamic tag with ref
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  );
}

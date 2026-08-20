"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  /** Per-child stagger delay in seconds. Default 0.1. */
  stagger?: number;
  /** Distance each child travels vertically. Default 25. */
  distance?: number;
  duration?: number;
}

/**
 * Staggers the entrance of its direct children with a subtle fade-up.
 * Reduced-motion: all children visible immediately.
 */
export function StaggerGroup({
  children,
  className = "",
  stagger = 0.1,
  distance = 25,
  duration = 0.8,
}: StaggerGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !groupRef.current) return;

      const kids = groupRef.current.children;
      if (kids.length === 0) return;

      gsap.fromTo(
        kids,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: groupRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: groupRef, dependencies: [stagger, distance, duration, reducedMotion] }
  );

  return (
    <div ref={groupRef} className={className}>
      {children}
    </div>
  );
}

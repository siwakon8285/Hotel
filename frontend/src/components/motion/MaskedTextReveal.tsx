"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface MaskedTextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: keyof HTMLElementTagNameMap;
}

/**
 * Text reveal using overflow-hidden and y-translation.
 */
export function MaskedTextReveal({
  children,
  className = "",
  delay = 0,
  duration = 1,
  as: Tag = "div",
}: MaskedTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !textRef.current || !containerRef.current) return;

    gsap.fromTo(
      textRef.current,
      { y: "100%" },
      {
        y: "0%",
        duration,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: containerRef, dependencies: [delay, duration, reducedMotion] });

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={containerRef} className={`overflow-hidden ${className}`}>
      {/* @ts-expect-error dynamic tag */}
      <Tag ref={textRef} className="block w-full h-full">
        {children}
      </Tag>
    </Tag>
  );
}

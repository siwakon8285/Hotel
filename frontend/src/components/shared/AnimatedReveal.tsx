"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedRevealProps {
  children: React.ReactNode;
  animation?: "fade-up" | "fade-in" | "scale-up" | "stagger-children";
  delay?: number;
  duration?: number;
  className?: string;
  parallaxSpeed?: number;
}

export function AnimatedReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 1,
  className = "",
  parallaxSpeed = 0,
}: AnimatedRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const el = containerRef.current;
      if (!el) return;

      // Parallax effect
      if (parallaxSpeed !== 0) {
        gsap.to(el, {
          yPercent: parallaxSpeed * 10,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
        return; // Skip reveal animation if doing parallax for background images
      }

      // Reveal animations
      const baseScrollTrigger = {
        trigger: el,
        start: "top 85%", // Trigger when element is 85% from top of viewport
        toggleActions: "play none none reverse",
      };

      if (animation === "fade-up") {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: baseScrollTrigger,
          }
        );
      } else if (animation === "fade-in") {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration,
            delay,
            ease: "power2.out",
            scrollTrigger: baseScrollTrigger,
          }
        );
      } else if (animation === "scale-up") {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: duration * 1.5,
            delay,
            ease: "power3.out",
            scrollTrigger: baseScrollTrigger,
          }
        );
      } else if (animation === "stagger-children") {
        const children = el.children;
        gsap.fromTo(
          children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: baseScrollTrigger,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert(); // Proper cleanup on unmount
  }, [animation, delay, duration, parallaxSpeed]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

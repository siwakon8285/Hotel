"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface RelatedRoomsClientProps {
  children: React.ReactNode;
}

export function RelatedRoomsClient({ children }: RelatedRoomsClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();
    const el = sectionRef.current;

    // Desktop/Tablet Cinematic Timeline
    mm.add("(min-width: 768px)", () => {
      // Setup initial states
      gsap.set(".rr-bg-wrapper", { clipPath: "inset(10% 5% 10% 5% round 2rem)" });
      gsap.set(".rr-bg-image", { scale: 1.08 });
      gsap.set(".rr-eyebrow", { yPercent: 100 });
      gsap.set(".rr-title-line", { yPercent: 120, rotate: 2 });
      
      const cards = gsap.utils.toArray<HTMLElement>(".rr-card-wrapper");
      cards.forEach((card, i) => {
        const xOffset = i === 0 ? -40 : i === 2 ? 40 : 0;
        gsap.set(card, { y: 100, x: xOffset, scale: 0.96, opacity: 0 });
        
        const img = card.querySelector(".room-card-image-wrapper img");
        if (img) gsap.set(img, { scale: 1.2 });
        
        const wrapper = card.querySelector(".room-card-image-wrapper");
        if (wrapper) gsap.set(wrapper, { clipPath: "inset(100% 0% 0% 0%)" });
      });

      gsap.set(".rr-divider", { xPercent: -101 });
      gsap.set(".rr-footer-brand", { y: 16, opacity: 0 });

      // Create Master Timeline with a short pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=90%", // Tighter 90vh scroll distance to resolve the scene without exhausting the user
          scrub: 1,
          pin: true,
        },
      });

      // 1. Background expansion
      tl.to(".rr-bg-wrapper", { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 2, ease: "power2.inOut" })
        .to(".rr-bg-image", { scale: 1, duration: 2, ease: "power2.inOut" }, "<")
        .to(".rr-bg-overlay", { opacity: 0.8, duration: 2 }, "<"); // Neutralize overlay for text reading

      // 2. Typography reveal
      tl.to(".rr-eyebrow", { yPercent: 0, duration: 0.8, ease: "power3.out" }, "-=1.2")
        .to(".rr-title-line", { yPercent: 0, rotate: 0, duration: 1, stagger: 0.15, ease: "power4.out" }, "-=0.8");

      // 3. Cards reveal with character
      cards.forEach((card) => {
        const wrapper = card.querySelector(".room-card-image-wrapper");
        const img = card.querySelector(".room-card-image-wrapper img");
        
        const cardTl = gsap.timeline();
        cardTl.to(card, { y: 0, x: 0, scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" })
              .to(wrapper, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut" }, "-=0.8")
              .to(img, { scale: 1, duration: 1.2, ease: "power3.out" }, "-=1");
              
        tl.add(cardTl, "-=0.9");
      });

      // 4. Scene Exit / Footer Transition (Achieves Perfect Final Frame)
      tl.to(".rr-bg-overlay", { opacity: 0.95, duration: 1.5, ease: "power2.inOut" }, "+=0.2") // Deepen background just slightly for footer
        .to(".rr-divider", { xPercent: 0, duration: 1.5, ease: "power3.out" }, "<0.2")
        .to(".rr-footer-brand", { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "<0.2");

      // 5. Visual Hold (Allows the user to scroll through a perfectly settled campaign shot)
      tl.to({}, { duration: 1.5 }); // Dummy tween to hold the frame before release
    });

    // Mobile (No Pin, simple trigger)
    mm.add("(max-width: 767px)", () => {
      gsap.set(".rr-eyebrow", { yPercent: 100 });
      gsap.set(".rr-title-line", { yPercent: 100 });
      gsap.set(".rr-card-wrapper", { y: 50, opacity: 0 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        animation: gsap.timeline()
          .to(".rr-eyebrow", { yPercent: 0, duration: 0.6 })
          .to(".rr-title-line", { yPercent: 0, duration: 0.8, stagger: 0.1 }, "-=0.4")
          .to(".rr-card-wrapper", { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, "-=0.4")
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion] });

  return (
    <section ref={sectionRef} className="relative z-30 -mt-16 md:-mt-24 overflow-hidden bg-zinc-950">
      {children}
    </section>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Room } from "@/types";
import { roomService } from "@/services/room.service";
import { formatPrice } from "@/lib/money";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MaskedTextReveal } from "@/components/motion/MaskedTextReveal";

gsap.registerPlugin(ScrollTrigger);

interface StayContextProps {
  room: Room;
}

type AvailabilityStatus = 'loading' | 'available' | 'unavailable' | 'idle';

export function StayContext({ room }: StayContextProps) {
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const guests = searchParams.get("guests");
  const containerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const [status, setStatus] = useState<AvailabilityStatus>('idle');

  useEffect(() => {
    let mounted = true;

    if (checkIn && checkOut) {
      setTimeout(() => { if (mounted) setStatus('loading'); }, 0);
      const parsedGuests = guests ? parseInt(guests, 10) : undefined;
      
      roomService.searchRooms({
        checkIn, checkOut, guests: parsedGuests
      }).then(results => {
        if (!mounted) return;
        const isAvailable = results.some(r => r.id === room.id);
        setStatus(isAvailable ? 'available' : 'unavailable');
      }).catch(() => {
        if (!mounted) return;
        setStatus('idle');
      });
    }

    return () => { mounted = false; };
  }, [checkIn, checkOut, guests, room.id]);

  useGSAP(() => {
    if (reducedMotion || !containerRef.current || !ctaRef.current) return;

    gsap.fromTo(ctaRef.current,
      { y: 50, scale: 0.95, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef, dependencies: [reducedMotion] });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formattedPrice = formatPrice(room.room_type.base_price);

  return (
    <section ref={containerRef} className="relative z-20 py-16 md:py-24 bg-zinc-950 text-white overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-8 md:-mt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
        <h2 className="text-sm uppercase tracking-[0.4em] font-semibold text-amber-500 mb-8">
          <MaskedTextReveal as="span">Your Stay</MaskedTextReveal>
        </h2>

        {checkIn && checkOut ? (
          <div className="mb-16">
            <h3 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg flex flex-col md:flex-row items-center justify-center gap-4">
              <MaskedTextReveal delay={0.1}>{formatDate(checkIn)}</MaskedTextReveal>
              <MaskedTextReveal delay={0.15} className="text-amber-500 font-light hidden md:block">—</MaskedTextReveal>
              <MaskedTextReveal delay={0.2}>{formatDate(checkOut)}</MaskedTextReveal>
            </h3>
            <div className="flex items-center justify-center gap-6 text-zinc-300 font-light text-xl mt-8">
              <span>{guests ? `${guests} Guest${parseInt(guests) > 1 ? 's' : ''}` : '2 Guests'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
              <span>THB {formattedPrice} / night</span>
            </div>
          </div>
        ) : (
          <div className="mb-16">
            <h3 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold mb-8 tracking-tight drop-shadow-lg leading-[1.1]">
              <MaskedTextReveal delay={0.1}>Ready to experience</MaskedTextReveal>
              <MaskedTextReveal delay={0.2} className="text-zinc-400 italic font-medium">{room.room_type.name}?</MaskedTextReveal>
            </h3>
            <p className="text-zinc-300 font-light text-xl md:text-2xl mt-8">
              From THB {formattedPrice} <span className="text-zinc-500 text-lg">/ night</span>
            </p>
          </div>
        )}

        <div ref={ctaRef} className="max-w-md mx-auto relative group mt-12">
          {/* Ambient glow behind button */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-lg blur opacity-25 group-hover:opacity-70 transition duration-1000 group-hover:duration-300" />
          
          <div className="relative bg-zinc-950 border border-white/10 p-1.5 rounded-lg">
            {status === 'loading' && (
              <div className="py-4 text-amber-500/70 uppercase tracking-widest text-sm animate-pulse text-center">
                Verifying Availability...
              </div>
            )}
            
            {status === 'unavailable' && (
              <div className="py-4 mb-4 text-red-400 font-medium text-center">
                Unavailable for your selected dates
              </div>
            )}

            {status === 'available' && (
              <div className="py-4 mb-4 text-emerald-400 font-medium text-center">
                Available for your selected dates
              </div>
            )}

            {checkIn && checkOut && status === 'available' ? (
              <button
                disabled
                className="w-full block text-center bg-zinc-800 text-zinc-500 font-semibold tracking-[0.2em] uppercase text-sm px-8 py-5 cursor-not-allowed rounded transition-all"
                title="Booking API coming soon in Branch 10"
              >
                Continue to Booking
              </button>
            ) : (
              <Link 
                href={checkIn && checkOut ? `/rooms?check_in=${checkIn}&check_out=${checkOut}${guests ? `&guests=${guests}` : ''}` : '/rooms'}
                className="w-full block text-center bg-white text-zinc-950 font-semibold tracking-[0.2em] uppercase text-sm px-8 py-5 hover:bg-amber-50 transition-colors duration-300 rounded"
              >
                {checkIn && checkOut && status === 'unavailable' ? 'Search other rooms' : 'Check Availability'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { RoomType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Users, BedDouble } from "lucide-react";
import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";

interface FeaturedRoomsSectionProps {
  roomTypes: RoomType[];
}

// Temporary mapping of images to room types for presentation
const roomImages: Record<string, string> = {
  "DELUXE_ROOM": HOTEL_IMAGES.rooms.deluxe,
  "PREMIER_ROOM": HOTEL_IMAGES.rooms.deluxe, // fallback
  "EXECUTIVE_SUITE": HOTEL_IMAGES.rooms.suite,
  "AURORA_SIGNATURE_SUITE": HOTEL_IMAGES.rooms.suite, // fallback
};

export function FeaturedRoomsSection({ roomTypes }: FeaturedRoomsSectionProps) {
  // Only show top 2 or 3 rooms for the featured section
  const featured = roomTypes.slice(0, 2);

  return (
    <section className="py-24 md:py-32 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <AnimatedReveal animation="fade-up">
              <h2 className="text-sm md:text-base font-semibold tracking-[0.2em] text-amber-500 uppercase mb-4">
                Accommodations
              </h2>
              <h3 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
                Featured Rooms & Suites
              </h3>
            </AnimatedReveal>
          </div>
          <AnimatedReveal animation="fade-up" delay={0.2}>
            <a href="/rooms" className="group inline-flex items-center text-sm uppercase tracking-[0.2em] font-medium text-zinc-300 hover:text-white transition-colors">
              View All Rooms
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </AnimatedReveal>
        </div>

        {/* Room Cards - Invisible Frame Style */}
        <div className="space-y-24 md:space-y-32">
          {featured.map((room, index) => {
            const isEven = index % 2 === 0;
            const imgSrc = roomImages[room.name.toUpperCase().replace(/\s+/g, '_')] || HOTEL_IMAGES.rooms.deluxe;

            return (
              <div 
                key={room.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center group`}
              >
                {/* Image Side */}
                <AnimatedReveal 
                  animation="fade-up" 
                  className="w-full lg:w-3/5 overflow-hidden relative aspect-[4/3] bg-zinc-900"
                >
                  <Image
                    src={imgSrc}
                    alt={room.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                </AnimatedReveal>

                {/* Content Side */}
                <div className="w-full lg:w-2/5 flex flex-col justify-center space-y-6">
                  <AnimatedReveal animation="fade-up" delay={0.2}>
                    <h4 className="font-heading text-3xl md:text-4xl font-bold">
                      {room.name}
                    </h4>
                  </AnimatedReveal>
                  
                  <AnimatedReveal animation="fade-up" delay={0.3}>
                    <p className="text-zinc-400 text-lg font-light leading-relaxed">
                      Experience ultimate relaxation with premium amenities, stunning views, and meticulous attention to detail in our {room.name}.
                    </p>
                  </AnimatedReveal>
                  
                  <AnimatedReveal animation="fade-up" delay={0.4} className="flex gap-6 py-4 border-y border-white/10">
                    <div className="flex items-center text-zinc-300">
                      <Users className="w-5 h-5 mr-3 text-amber-500" />
                      <span className="text-sm font-medium uppercase tracking-wider">{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center text-zinc-300">
                      <BedDouble className="w-5 h-5 mr-3 text-amber-500" />
                      <span className="text-sm font-medium uppercase tracking-wider">King Bed</span>
                    </div>
                  </AnimatedReveal>

                  <AnimatedReveal animation="fade-up" delay={0.5} className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Starting from</p>
                      <p className="text-2xl font-light text-white">
                        {formatCurrency(room.base_price)}
                        <span className="text-sm text-zinc-500 ml-2">/ night</span>
                      </p>
                    </div>
                    <a href={`/rooms/${room.id}`} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </AnimatedReveal>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

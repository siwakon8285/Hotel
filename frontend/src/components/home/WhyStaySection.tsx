"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { Wifi, Waves, Coffee, MonitorPlay, Bath, Wind } from "lucide-react";

const amenities = [
  { icon: Waves, title: "Ocean View", description: "Breathtaking panoramic views of the sea." },
  { icon: Bath, title: "Luxury Bath", description: "Deep soaking tubs and premium toiletries." },
  { icon: Coffee, title: "Room Service", description: "24/7 in-room dining from our signature restaurant." },
  { icon: Wifi, title: "High-Speed Wi-Fi", description: "Stay connected with complimentary gigabit internet." },
  { icon: MonitorPlay, title: "Smart TV", description: "65-inch displays with casting capabilities." },
  { icon: Wind, title: "Climate Control", description: "Personalized intelligent room climate systems." },
];

export function WhyStaySection() {
  return (
    <section className="py-24 md:py-32 bg-white text-zinc-900 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <AnimatedReveal animation="fade-up">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-amber-600 uppercase mb-4">
              Hotel Amenities
            </h2>
            <h3 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Designed for Comfort
            </h3>
          </AnimatedReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {amenities.map((item, index) => (
            <AnimatedReveal 
              key={index} 
              animation="fade-up" 
              delay={index * 0.1}
              className="group flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors duration-300 text-zinc-400">
                <item.icon strokeWidth={1.5} className="w-7 h-7" />
              </div>
              <h4 className="font-heading text-xl font-semibold">{item.title}</h4>
              <p className="text-zinc-500 font-light leading-relaxed max-w-xs">
                {item.description}
              </p>
            </AnimatedReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

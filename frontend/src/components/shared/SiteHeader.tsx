"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4 shadow-sm" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <span className="font-heading text-xl md:text-2xl font-bold tracking-widest text-white uppercase drop-shadow-md">
            Aurora
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-zinc-300">
          <Link href="/rooms" className="hover:text-white transition-colors">Rooms</Link>
          <Link href="/dining" className="hover:text-white transition-colors">Dining</Link>
          <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
          <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-none tracking-widest bg-transparent transition-colors">
            Book Now
          </Button>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrolled = useRef(false);

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 60;
    // Only update state when the threshold is actually crossed
    if (scrolled !== lastScrolled.current) {
      lastScrolled.current = scrolled;
      setIsScrolled(scrolled);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-zinc-950/85 backdrop-blur-md border-b border-white/5 py-3 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <span className="font-heading text-xl md:text-2xl font-bold tracking-widest text-white uppercase drop-shadow-md">
            Aurora
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-zinc-300">
          <Link href="/rooms" className="hover:text-white transition-colors">Rooms</Link>
          <Link href="/dining" className="hover:text-white transition-colors">Dining</Link>
          <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
          <Button variant="outline" className="border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-none tracking-widest bg-transparent transition-colors">
            Book Now
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-md border-t border-white/5 px-6 py-8 space-y-6">
          <Link href="/rooms" className="block text-sm uppercase tracking-[0.15em] text-zinc-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Rooms</Link>
          <Link href="/dining" className="block text-sm uppercase tracking-[0.15em] text-zinc-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dining</Link>
          <Link href="/gallery" className="block text-sm uppercase tracking-[0.15em] text-zinc-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
          <Button variant="outline" className="w-full border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-none tracking-widest bg-transparent transition-colors">
            Book Now
          </Button>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-heading text-xl md:text-2xl font-semibold tracking-wider text-primary">
            AURORA GRAND
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
          <Link href="#hotel" className="text-muted-foreground hover:text-primary transition-colors">Hotel</Link>
          <Link href="#rooms" className="text-muted-foreground hover:text-primary transition-colors">Rooms</Link>
          <Link href="#experience" className="text-muted-foreground hover:text-primary transition-colors">Experience</Link>
          <Link href="#booking" className="text-muted-foreground hover:text-primary transition-colors">Booking</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden md:inline-flex border-accent text-accent-foreground hover:bg-accent/10">
            Book Now
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

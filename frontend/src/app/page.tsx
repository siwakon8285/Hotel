import { hotelService } from "@/services/hotel.service";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { Button } from "@/components/ui/button";

// Optional: Fallback to prevent crashing if the backend is down during rendering
async function getHotelData() {
  try {
    const hotels = await hotelService.getHotels();
    return hotels[0] || null;
  } catch (error) {
    console.error("Failed to load hotel data:", error);
    return null;
  }
}

export default async function Home() {
  const hotel = await getHotelData();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-20">
        <section className="relative w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center space-y-8 z-10">
          <div className="space-y-4">
            <h2 className="text-sm md:text-base font-semibold tracking-[0.2em] text-accent uppercase">
              Welcome to
            </h2>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
              {hotel ? hotel.name : "AURORA GRAND HOTEL"}
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl font-light">
              {hotel 
                ? hotel.description 
                : "Explore an immersive hotel experience, from architecture to room selection. Stay Beyond the Ordinary."}
            </p>
          </div>

          <div className="pt-8">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-none tracking-wide">
              Explore the Hotel
            </Button>
          </div>
        </section>

        {/* 3D Canvas Placeholder Area */}
        <section className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
          <div className="w-full aspect-video max-h-[60vh] bg-muted/30 border border-border flex items-center justify-center rounded-sm">
            <div className="text-center space-y-2 opacity-50">
              <div className="text-xl font-heading tracking-widest uppercase">3D Hotel Experience</div>
              <p className="text-sm">Coming in the next implementation phase</p>
            </div>
          </div>
        </section>
        
        {/* Error State Warning (Development) */}
        {!hotel && (
          <div className="fixed bottom-4 right-4 bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-sm text-sm">
            Unable to load hotel information from backend.
          </div>
        )}
      </main>
    </div>
  );
}

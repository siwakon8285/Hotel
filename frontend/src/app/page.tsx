import { hotelService } from "@/services/hotel.service";
import { roomService } from "@/services/room.service";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { FeaturedRoomsSection } from "@/components/home/FeaturedRoomsSection";
import { WhyStaySection } from "@/components/home/WhyStaySection";
import { SignatureExperienceSection } from "@/components/home/SignatureExperienceSection";
import { GallerySection } from "@/components/home/GallerySection";
import { BookingCTASection } from "@/components/home/BookingCTASection";
import { SiteFooter } from "@/components/home/SiteFooter";

async function getHotelData() {
  try {
    const hotels = await hotelService.getHotels();
    return hotels[0] || null;
  } catch (error) {
    console.error("Failed to load hotel data:", error);
    return null;
  }
}

async function getRoomTypes() {
  try {
    // We fetch some rooms and extract unique room types since there isn't a direct /room-types endpoint
    // Using arbitrary dates or empty dates to get general availability if the API allows it
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const rooms = await roomService.searchRooms(today, tomorrow);
    
    const typesMap = new Map();
    rooms.forEach(r => {
      if (r.room_type && !typesMap.has(r.room_type.id)) {
        typesMap.set(r.room_type.id, r.room_type);
      }
    });
    
    return Array.from(typesMap.values());
  } catch (error) {
    console.error("Failed to load room types:", error);
    return [];
  }
}

export default async function Home() {
  const hotel = await getHotelData();
  const roomTypes = await getRoomTypes();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 font-sans selection:bg-amber-500/30 selection:text-white overflow-hidden">
      
      <SiteHeader />
      
      <main className="flex-1 flex flex-col">
        <HeroSection 
          hotelName={hotel?.name || "AURORA GRAND HOTEL"} 
          description={hotel?.description || "Explore an immersive hotel experience, from architecture to room selection. Stay Beyond the Ordinary."}
        />
        
        <IntroSection />
        
        <FeaturedRoomsSection roomTypes={roomTypes} />
        
        <WhyStaySection />
        
        <SignatureExperienceSection />
        
        <GallerySection />
        
        <BookingCTASection />
      </main>

      <SiteFooter />

      {!hotel && (
        <div className="fixed bottom-4 right-4 bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-sm text-sm z-50">
          Unable to load hotel information from backend.
        </div>
      )}
    </div>
  );
}

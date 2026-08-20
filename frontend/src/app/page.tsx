import { hotelService } from "@/services/hotel.service";
import { roomService } from "@/services/room.service";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { FeaturedRoomsSection } from "@/components/home/FeaturedRoomsSection";
import { WhyStaySection } from "@/components/home/WhyStaySection";
import { SignatureExperienceSection } from "@/components/home/SignatureExperienceSection";
import { GallerySection } from "@/components/home/GallerySection";
import { BookingCTASection } from "@/components/home/BookingCTASection";

async function getHotelData() {
  try {
    const hotels = await hotelService.getHotels();
    return hotels[0] || null;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === "NETWORK_ERROR") {
      console.warn("[Hotel Data] Backend unavailable during render. Using graceful fallback.");
    } else {
      console.error("[Hotel Data] Unexpected error:", error);
    }
    return null;
  }
}

async function getRoomTypes() {
  try {
    // Fetch all rooms without dates to get base room types. 
    // This allows the homepage to be statically generated and cached effectively.
    const rooms = await roomService.searchRooms();
    
    const typesMap = new Map();
    rooms.forEach(r => {
      if (r.room_type && !typesMap.has(r.room_type.id)) {
        typesMap.set(r.room_type.id, r.room_type);
      }
    });
    
    return Array.from(typesMap.values());
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === "NETWORK_ERROR") {
      console.warn("[Room Types] Backend unavailable during render. Returning empty rooms.");
    } else {
      console.error("[Room Types] Unexpected error:", error);
    }
    return [];
  }
}

// ISR caching for the homepage: revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const hotel = await getHotelData();
  const roomTypes = await getRoomTypes();

  return (
    <>
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

      {!hotel && (
        <div className="fixed bottom-4 right-4 bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-sm text-sm z-50">
          Unable to load hotel information from backend.
        </div>
      )}
    </>
  );
}

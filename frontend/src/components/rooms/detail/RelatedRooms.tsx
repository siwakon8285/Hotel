import { Room } from "@/types";
import { roomService } from "@/services/room.service";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RelatedRoomsClient } from "@/components/rooms/detail/RelatedRoomsClient";
import Image from "next/image";
import { HOTEL_IMAGES } from "@/lib/images";

interface RelatedRoomsProps {
  currentRoom: Room;
  searchParams: {
    check_in?: string;
    check_out?: string;
    guests?: string;
  };
}

export async function RelatedRooms({ currentRoom, searchParams }: RelatedRoomsProps) {
  let allRooms: Room[] = [];
  try {
    allRooms = await roomService.searchRooms({});
  } catch (error) {
    console.error("Failed to load related rooms:", error);
    return null;
  }

  const related = allRooms.filter(r => r.id !== currentRoom.id).slice(0, 3);

  if (related.length === 0) return null;

  const buildHref = (roomId: string) => {
    const p = new URLSearchParams();
    if (searchParams.check_in) p.set("check_in", searchParams.check_in);
    if (searchParams.check_out) p.set("check_out", searchParams.check_out);
    if (searchParams.guests) p.set("guests", searchParams.guests);
    const qs = p.toString();
    return qs ? `/rooms/${roomId}?${qs}` : `/rooms/${roomId}`;
  };

  return (
    <RelatedRoomsClient>
      {/* Background Layer controlled by GSAP */}
      <div className="absolute inset-0 z-0 bg-zinc-950 rr-bg-wrapper">
        <Image
          src={HOTEL_IMAGES.intro}
          alt="Hotel Background"
          fill
          sizes="100vw"
          className="object-cover opacity-40 rr-bg-image"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950 rr-bg-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-12 md:pt-40 md:pb-16">
        
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <div className="overflow-hidden mb-6">
            <h2 className="text-xs uppercase tracking-[0.4em] font-semibold text-amber-500 drop-shadow-sm rr-eyebrow">
              Continue Exploring
            </h2>
          </div>
          
          <h3 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            <div className="overflow-hidden">
              <span className="block rr-title-line">Other rooms</span>
            </div>
            <div className="overflow-hidden">
              <span className="block italic text-zinc-400 rr-title-line">you might like.</span>
            </div>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 rr-cards-container">
          {related.map((room, idx) => (
            <div key={room.id} className="rr-card-wrapper" data-index={idx}>
              <RoomCard 
                room={room} 
                exploreHref={buildHref(room.id)}
              />
            </div>
          ))}
        </div>
        
        {/* Footer Transition Element */}
        <div className="mt-12 md:mt-16 w-full flex justify-center rr-footer-line overflow-hidden">
          <div className="w-16 h-[1px] bg-zinc-700 rr-divider" />
        </div>
        <div className="text-center mt-6 overflow-hidden">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-600 rr-footer-brand">Aurora Grand Hotel</p>
        </div>
      </div>
    </RelatedRoomsClient>
  );
}

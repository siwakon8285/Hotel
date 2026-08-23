import Image from "next/image";
import Link from "next/link";
import { Room } from "@/types";
import { getRoomTypeImage } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { Wifi, Waves, Coffee, MonitorPlay, Bath, Wind } from "lucide-react";
import { formatPrice } from "@/lib/money";

interface RoomCardProps {
  room: Room;
  exploreHref?: string;
}

// Simple mapping from name to icon for visual polish
const iconMap: Record<string, React.ElementType> = {
  "Ocean View": Waves,
  "Luxury Bath": Bath,
  "Room Service": Coffee,
  "High-Speed Wi-Fi": Wifi,
  "Smart TV": MonitorPlay,
  "Climate Control": Wind,
};

export function RoomCard({ room, exploreHref }: RoomCardProps) {
  const { room_type } = room;
  const imageSrc = getRoomTypeImage(room_type.name);

  // Format the price directly from the backend string, 
  // avoiding floating-point math as instructed.
  // The backend returns e.g. "4500.00"
  const formattedBaht = formatPrice(room_type.base_price);

  return (
    <Reveal animation="fade-up">
      <div className="group flex flex-col bg-white border border-zinc-100 transition-all duration-500 hover:border-zinc-200 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 room-card-image-wrapper">
          <Image
            src={imageSrc}
            alt={room_type.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
          />
        </div>
        
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <h3 className="font-heading text-2xl font-bold mb-2 text-zinc-900 transition-colors duration-300 group-hover:text-amber-800">
            {room_type.name}
          </h3>
          
          <div className="flex flex-wrap items-center text-sm text-zinc-500 mb-6 gap-x-2 gap-y-1">
            <span>{room_type.bed_type}</span>
            <span className="text-zinc-300">•</span>
            <span>{room_type.max_guests} Guests</span>
            <span className="text-zinc-300">•</span>
            <span>{room_type.room_size} m²</span>
          </div>

          {/* Amenities (limit to top 3 for clean card UI) */}
          <div className="flex items-center gap-4 mb-8">
            {room.amenities.slice(0, 3).map((amenity) => {
              const Icon = iconMap[amenity.name] || Wifi; // Fallback icon
              return (
                <div key={amenity.id} className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 transition-colors duration-300 group-hover:text-amber-700">
                  <Icon className="w-3.5 h-3.5 text-amber-500" />
                  <span>{amenity.name}</span>
                </div>
              );
            })}
            {room.amenities.length > 3 && (
              <span className="text-xs text-zinc-400">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-zinc-100 flex items-end justify-between overflow-hidden relative">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1 transition-colors group-hover:text-zinc-500">
                From
              </p>
              <p className="font-heading text-xl md:text-2xl font-bold text-zinc-900">
                THB {formattedBaht} <span className="text-sm font-normal text-zinc-500">/ night</span>
              </p>
            </div>
            
            {exploreHref ? (
              <Link
                href={exploreHref}
                className="relative inline-flex items-center text-sm uppercase tracking-widest font-medium text-amber-600 group/cta"
              >
                <span className="relative z-10 transition-transform duration-500 ease-out group-hover:translate-x-1">Explore</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-600 transition-all duration-500 ease-out group-hover:w-full" />
              </Link>
            ) : (
              <button
                className="text-sm uppercase tracking-widest font-medium text-amber-600 transition-colors disabled:opacity-50"
                disabled
                title="Room details coming soon"
              >
                Explore
              </button>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

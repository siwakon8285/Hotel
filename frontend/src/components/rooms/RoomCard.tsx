import Image from "next/image";
import { Room } from "@/types";
import { getRoomTypeImage } from "@/lib/images";
import { Reveal } from "@/components/motion/Reveal";
import { Wifi, Waves, Coffee, MonitorPlay, Bath, Wind } from "lucide-react";

interface RoomCardProps {
  room: Room;
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

export function RoomCard({ room }: RoomCardProps) {
  const { room_type } = room;
  const imageSrc = getRoomTypeImage(room_type.name);

  // Format the price directly from the backend string, 
  // avoiding floating-point math as instructed.
  // The backend returns e.g. "4500.00"
  const priceParts = room_type.base_price.split(".");
  const formattedBaht = new Intl.NumberFormat('en-US').format(parseInt(priceParts[0], 10));

  return (
    <Reveal animation="fade-up">
      <div className="group flex flex-col bg-white border border-zinc-100 transition-colors hover:border-zinc-200">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
          <Image
            src={imageSrc}
            alt={room_type.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <h3 className="font-heading text-2xl font-bold mb-2 text-zinc-900">
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
                <div key={amenity.id} className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <Icon className="w-3.5 h-3.5 text-amber-600" />
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

          <div className="mt-auto pt-6 border-t border-zinc-100 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">
                From
              </p>
              <p className="font-heading text-xl md:text-2xl font-bold text-zinc-900">
                THB {formattedBaht} <span className="text-sm font-normal text-zinc-500">/ night</span>
              </p>
            </div>
            
            <button
              className="text-sm uppercase tracking-widest font-medium text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-50"
              disabled
              title="Room details coming soon"
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

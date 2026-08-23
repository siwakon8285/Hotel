import { Room } from "@/types";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Wifi, Waves, Coffee, MonitorPlay, Bath, Wind, CheckCircle2 } from "lucide-react";

interface RoomAmenitiesProps {
  room: Room;
}

const iconMap: Record<string, React.ElementType> = {
  "Ocean View": Waves,
  "Luxury Bath": Bath,
  "Room Service": Coffee,
  "High-Speed Wi-Fi": Wifi,
  "Smart TV": MonitorPlay,
  "Climate Control": Wind,
};

export function RoomAmenities({ room }: RoomAmenitiesProps) {
  if (!room.amenities || room.amenities.length === 0) return null;

  return (
    <section className="py-32 bg-zinc-50 border-y border-zinc-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-zinc-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-zinc-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10">
        <Reveal animation="fade-up">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
              Curated Comforts
            </h2>
            <p className="text-zinc-500 font-light text-lg md:text-xl max-w-2xl mx-auto">
              Everything you need to enhance your stay, thoughtfully selected for your comfort.
            </p>
          </div>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10" stagger={0.15} distance={80}>
          {room.amenities.map((amenity) => {
            const Icon = iconMap[amenity.name] || CheckCircle2;
            return (
              <div key={amenity.id} className="group flex flex-col p-10 rounded-[2rem] bg-white border border-zinc-100 hover:border-amber-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out">
                <div className="mb-8 inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-zinc-50 group-hover:bg-amber-50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
                  <Icon className="w-6 h-6 text-zinc-400 group-hover:text-amber-600 transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-zinc-900 mb-2 group-hover:text-amber-700 transition-colors duration-300">{amenity.name}</h4>
                  <p className="text-sm text-zinc-500 font-light leading-relaxed">
                    Included with your reservation.
                  </p>
                </div>
              </div>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

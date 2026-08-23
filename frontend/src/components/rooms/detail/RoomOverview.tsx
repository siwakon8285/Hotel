import { Room } from "@/types";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Users, BedDouble, Maximize, ArrowUpToLine, DoorOpen } from "lucide-react";

interface RoomOverviewProps {
  room: Room;
}

export function RoomOverview({ room }: RoomOverviewProps) {
  const { room_type, floor } = room;

  return (
    <section className="relative z-10 py-32 bg-zinc-50 border-b border-zinc-100 rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-2xl -mt-16 md:-mt-24 transition-transform">
      <div className="max-w-6xl mx-auto px-6 md:px-10 mt-8 md:mt-12">
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-8" stagger={0.25} distance={60}>
          <div className="flex flex-col items-center text-center space-y-5 group cursor-default">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm group-hover:border-amber-200 group-hover:shadow-md transition-all duration-300">
              <BedDouble className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">Bed Type</p>
              <p className="text-base font-medium text-zinc-900">{room_type.bed_type}</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-5 group cursor-default">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm group-hover:border-amber-200 group-hover:shadow-md transition-all duration-300">
              <Users className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">Capacity</p>
              <p className="text-base font-medium text-zinc-900">{room_type.max_guests} Guests</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-5 group cursor-default">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm group-hover:border-amber-200 group-hover:shadow-md transition-all duration-300">
              <Maximize className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">Room Size</p>
              <p className="text-base font-medium text-zinc-900">{room_type.room_size} m²</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-5 group cursor-default">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm group-hover:border-amber-200 group-hover:shadow-md transition-all duration-300">
              <ArrowUpToLine className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">Floor</p>
              <p className="text-base font-medium text-zinc-900">Level {floor?.floor_number || 1}</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-5 col-span-2 md:col-span-1 group cursor-default">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm group-hover:border-amber-200 group-hover:shadow-md transition-all duration-300">
              <DoorOpen className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">Room</p>
              <p className="text-base font-medium text-zinc-900">{room.room_number}</p>
            </div>
          </div>
        </StaggerGroup>
      </div>
    </section>
  );
}

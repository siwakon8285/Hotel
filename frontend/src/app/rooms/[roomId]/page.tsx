import { Metadata } from "next";
import { notFound } from "next/navigation";
import { roomService } from "@/services/room.service";
import { APIException } from "@/lib/api";
import { RoomHero } from "@/components/rooms/detail/RoomHero";
import { RoomOverview } from "@/components/rooms/detail/RoomOverview";
import { RoomGallery } from "@/components/rooms/detail/RoomGallery";
import { RoomAmenities } from "@/components/rooms/detail/RoomAmenities";
import { RoomStory } from "@/components/rooms/detail/RoomStory";
import { StayContext } from "@/components/rooms/detail/StayContext";
import { RelatedRooms } from "@/components/rooms/detail/RelatedRooms";

interface RoomDetailPageProps {
  params: Promise<{
    roomId: string;
  }>;
  searchParams: Promise<{
    check_in?: string;
    check_out?: string;
    guests?: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ roomId: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const room = await roomService.getRoomById(resolvedParams.roomId);
    return {
      title: `${room.room_type.name} | Aurora Grand Hotel`,
      description: room.room_type.description || `Discover the ${room.room_type.name} at Aurora Grand Hotel.`,
    };
  } catch {
    return {
      title: "Room | Aurora Grand Hotel",
    };
  }
}

export default async function RoomDetailPage({ params, searchParams }: RoomDetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  let room;
  try {
    room = await roomService.getRoomById(resolvedParams.roomId);
  } catch (err) {
    if (err instanceof APIException && err.code === "NOT_FOUND") {
      notFound();
    }
    // For 500s or network errors, we don't notFound(), we let the error boundary or a generic message handle it.
    // For simplicity, if we don't have an error boundary in this branch, we can render a safe message.
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24 pb-32">
        <div className="max-w-xl mx-auto px-6 text-center text-red-500 font-medium">
          An unexpected error occurred while loading the room. Please try again later.
        </div>
      </div>
    );
  }

  if (!room) {
    notFound();
  }

  return (
    <div className="w-full">
      <RoomHero room={room} />
      <RoomOverview room={room} />
      <RoomGallery room={room} />
      <RoomAmenities room={room} />
      <RoomStory room={room} />
      <StayContext room={room} />
      <RelatedRooms currentRoom={room} searchParams={resolvedSearchParams} />
    </div>
  );
}

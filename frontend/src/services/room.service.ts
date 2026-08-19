import { apiFetch } from "@/lib/api";
import { Room } from "@/types";

export const roomService = {
  searchRooms: async (checkIn: string, checkOut: string): Promise<Room[]> => {
    return apiFetch<Room[]>(`/rooms/search?checkIn=${checkIn}&checkOut=${checkOut}`);
  },
  
  getRoomsByFloor: async (floorId: string): Promise<Room[]> => {
    return apiFetch<Room[]>(`/floors/${floorId}/rooms`);
  }
};

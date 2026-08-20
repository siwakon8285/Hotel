import { apiFetch } from "@/lib/api";
import { Room } from "@/types";

export interface SearchRoomsParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomType?: string;
}

export const roomService = {
  searchRooms: async (params: SearchRoomsParams = {}): Promise<Room[]> => {
    const queryParams = new URLSearchParams();
    if (params.checkIn) queryParams.append('check_in', params.checkIn);
    if (params.checkOut) queryParams.append('check_out', params.checkOut);
    if (params.guests) queryParams.append('guests', params.guests.toString());
    if (params.roomType) queryParams.append('room_type', params.roomType);
    
    const queryStr = queryParams.toString();
    const url = queryStr ? `/rooms/search?${queryStr}` : '/rooms/search';
    
    return apiFetch<Room[]>(url);
  },
  
  getRoomsByFloor: async (floorId: string): Promise<Room[]> => {
    return apiFetch<Room[]>(`/floors/${floorId}/rooms`);
  }
};

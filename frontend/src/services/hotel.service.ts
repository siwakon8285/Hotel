import { apiFetch } from "@/lib/api";
import { Hotel } from "@/types";

export const hotelService = {
  getHotels: async (): Promise<Hotel[]> => {
    return apiFetch<Hotel[]>("/hotels");
  },
  
  getHotelById: async (id: string): Promise<Hotel> => {
    return apiFetch<Hotel>(`/hotels/${id}`);
  }
};

import { create } from 'zustand';

export type ExperienceView = 
  | 'HOTEL_VIEW'
  | 'FLOOR_VIEW'
  | 'ROOM_VIEW'
  | 'ROOM_INTERIOR'
  | 'BOOKING';

interface ExperienceState {
  currentView: ExperienceView;
  selectedHotelId: string | null;
  selectedFloorId: string | null;
  selectedRoomId: string | null;
  
  // Actions
  setView: (view: ExperienceView) => void;
  selectHotel: (id: string | null) => void;
  selectFloor: (id: string | null) => void;
  selectRoom: (id: string | null) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  currentView: 'HOTEL_VIEW',
  selectedHotelId: null,
  selectedFloorId: null,
  selectedRoomId: null,
  
  setView: (view) => set({ currentView: view }),
  selectHotel: (id) => set({ selectedHotelId: id }),
  selectFloor: (id) => set({ selectedFloorId: id }),
  selectRoom: (id) => set({ selectedRoomId: id }),
}));

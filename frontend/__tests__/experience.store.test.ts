import { useExperienceStore } from '@/stores/experience.store';

describe('Experience Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useExperienceStore.getState();
    store.setView('HOTEL_VIEW');
    store.selectHotel(null);
    store.selectFloor(null);
    store.selectRoom(null);
  });

  it('should have initial state HOTEL_VIEW', () => {
    const state = useExperienceStore.getState();
    expect(state.currentView).toBe('HOTEL_VIEW');
    expect(state.selectedHotelId).toBeNull();
  });

  it('should correctly set view', () => {
    useExperienceStore.getState().setView('ROOM_VIEW');
    const state = useExperienceStore.getState();
    expect(state.currentView).toBe('ROOM_VIEW');
  });

  it('should correctly select hotel', () => {
    useExperienceStore.getState().selectHotel('hotel-123');
    const state = useExperienceStore.getState();
    expect(state.selectedHotelId).toBe('hotel-123');
  });
});

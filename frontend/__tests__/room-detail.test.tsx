import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoomDetailPage from '@/app/rooms/[roomId]/page';
import { StayContext } from '@/components/rooms/detail/StayContext';
import { roomService } from '@/services/room.service';
import { Room } from '@/types';
import { useSearchParams } from 'next/navigation';

// Mock intersection observer for Reveal component
class IntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

jest.mock('@/services/room.service', () => ({
  roomService: {
    getRoomById: jest.fn(),
    searchRooms: jest.fn(),
  }
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock('@/components/rooms/detail/RelatedRooms', () => ({
  RelatedRooms: () => <div data-testid="related-rooms">Related Rooms</div>
}));

const mockRoom: Room = {
  id: "room-123",
  room_number: "801",
  status: "available",
  model_key: "key",
  floor: {
    id: "f-1",
    floor_number: 8,
    name: "Floor 8",
    description: "",
  },
  room_type: {
    id: "rt-1",
    name: "Presidential Suite",
    base_price: "25000.00",
    currency: "THB",
    max_guests: 4,
    bed_type: "King Bed",
    room_size: 120,
    description: "A private retreat above the coast."
  },
  amenities: [
    { id: "a1", name: "Ocean View", icon: "waves" },
    { id: "a2", name: "Luxury Bath", icon: "bath" }
  ]
};

describe('RoomDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders room details correctly', async () => {
    (roomService.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
    (roomService.searchRooms as jest.Mock).mockResolvedValue([]);
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    const page = await RoomDetailPage({
      params: Promise.resolve({ roomId: 'room-123' }),
      searchParams: Promise.resolve({})
    });
    render(page);

    // Hero
    expect(screen.getByText('PRESIDENTIAL SUITE')).toBeInTheDocument();
    expect(screen.getByText('Room 801')).toBeInTheDocument();
    
    // Price from Hero/Overview
    expect(screen.getAllByText(/25,000/i).length).toBeGreaterThan(0);

    // Overview
    expect(screen.getAllByText('King Bed').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4 Guests/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/120 m²/i).length).toBeGreaterThan(0);

    // Amenities
    expect(screen.getByText('Ocean View')).toBeInTheDocument();
    expect(screen.getByText('Luxury Bath')).toBeInTheDocument();
  });
});

describe('StayContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays Check Availability button if no dates provided', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    
    render(<StayContext room={mockRoom} />);
    
    expect(screen.getByRole('link', { name: /Check Availability/i })).toBeInTheDocument();
  });

  it('checks availability and shows Continue to Booking if available', async () => {
    jest.useFakeTimers();
    const params = new URLSearchParams();
    params.set('check_in', '2026-08-24');
    params.set('check_out', '2026-08-25');
    params.set('guests', '2');
    (useSearchParams as jest.Mock).mockReturnValue(params);

    // Room is available
    (roomService.searchRooms as jest.Mock).mockResolvedValue([mockRoom]);

    render(<StayContext room={mockRoom} />);
    
    act(() => {
      jest.runAllTimers();
    });

    // Should wait for loading to finish and show availability text
    await waitFor(() => {
      expect(screen.getByText(/Available for your selected dates/i)).toBeInTheDocument();
    });

    const btn = screen.getByRole('button', { name: /Continue to Booking/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
    
    jest.useRealTimers();
  });

  it('checks availability and shows search again if unavailable', async () => {
    jest.useFakeTimers();
    const params = new URLSearchParams();
    params.set('check_in', '2026-08-24');
    params.set('check_out', '2026-08-25');
    params.set('guests', '2');
    (useSearchParams as jest.Mock).mockReturnValue(params);

    // Room is NOT available (returns empty or different room)
    (roomService.searchRooms as jest.Mock).mockResolvedValue([]);

    render(<StayContext room={mockRoom} />);

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText(/Unavailable for your selected dates/i)).toBeInTheDocument();
    });

    const link = screen.getByRole('link', { name: /Search other rooms/i });
    expect(link).toBeInTheDocument();
    
    jest.useRealTimers();
  });
});

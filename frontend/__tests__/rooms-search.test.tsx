import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RoomsSearchExperience } from '@/components/rooms/RoomsSearchExperience';
import { roomService } from '@/services/room.service';

// Mock Next.js navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

// Mock the room service
jest.mock('@/services/room.service', () => ({
  roomService: {
    searchRooms: jest.fn(),
  },
}));

const mockRoomTypes = [
  {
    id: "1",
    name: "Deluxe King",
    base_price: "4500.00",
    currency: "THB",
    max_guests: 2,
    bed_type: "King Bed",
    room_size: 42,
  },
];

const mockRooms = [
  {
    id: "room1",
    room_number: "101",
    status: "available",
    model_key: "r101",
    floor: { id: "f1", floor_number: 1, name: "1st Floor", description: "" },
    room_type: mockRoomTypes[0],
    amenities: [
      { id: "a1", name: "High-Speed Wi-Fi", icon: "wifi" }
    ],
  },
];

describe('RoomsSearchExperience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search form and performs initial empty search', async () => {
    (roomService.searchRooms as jest.Mock).mockResolvedValue(mockRooms);
    
    render(<RoomsSearchExperience />);
    
    expect(screen.getByText(/Searching available rooms.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(roomService.searchRooms).toHaveBeenCalledWith({
        checkIn: undefined,
        checkOut: undefined,
        guests: undefined,
        roomType: undefined,
      });
    });
    
    expect(screen.getAllByText('Deluxe King').length).toBeGreaterThan(0);
  });

  it('shows error message if checkout is before checkin', async () => {
    (roomService.searchRooms as jest.Mock).mockResolvedValue(mockRooms);
    render(<RoomsSearchExperience />);
    
    await waitFor(() => expect(screen.queryByText(/Searching/i)).not.toBeInTheDocument());

    const checkInInput = screen.getByLabelText(/Check-in/i);
    const checkOutInput = screen.getByLabelText(/Check-out/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(checkInInput, { target: { value: '2026-10-15' } });
    fireEvent.change(checkOutInput, { target: { value: '2026-10-10' } });
    fireEvent.submit(searchButton.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Check-out must be after check-in')).toBeInTheDocument();
    });
    
    // Router should not be called due to validation error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows error if guests is less than 1', async () => {
    (roomService.searchRooms as jest.Mock).mockResolvedValue(mockRooms);
    render(<RoomsSearchExperience />);
    
    await waitFor(() => expect(screen.queryByText(/Searching/i)).not.toBeInTheDocument());

    const guestsInput = screen.getByLabelText(/Guests/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(guestsInput, { target: { value: '0' } });
    fireEvent.submit(searchButton.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('At least 1 guest required')).toBeInTheDocument();
    });
  });

  it('clears validation error when field is updated', async () => {
    (roomService.searchRooms as jest.Mock).mockResolvedValue(mockRooms);
    render(<RoomsSearchExperience />);
    await waitFor(() => expect(screen.queryByText(/Searching/i)).not.toBeInTheDocument());

    const checkInInput = screen.getByLabelText(/Check-in/i);
    const checkOutInput = screen.getByLabelText(/Check-out/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    // Trigger error
    fireEvent.change(checkInInput, { target: { value: '2026-10-15' } });
    fireEvent.change(checkOutInput, { target: { value: '2026-10-10' } });
    fireEvent.submit(searchButton.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Check-out must be after check-in')).toBeInTheDocument();
    });

    // Fix error
    fireEvent.change(checkOutInput, { target: { value: '2026-10-20' } });

    // Error should disappear without submitting
    await waitFor(() => {
      expect(screen.queryByText('Check-out must be after check-in')).not.toBeInTheDocument();
    });
  });

  it('clears API error when user starts typing', async () => {
    // Suppress expected error log for this specific test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (roomService.searchRooms as jest.Mock)
      .mockResolvedValueOnce(mockRooms) // Fetch room types
      .mockRejectedValueOnce(new Error('Network error')); // Initial search
    render(<RoomsSearchExperience />);
    
    // Wait for API error
    await waitFor(() => {
      expect(screen.getByText(/Failed to load rooms/i)).toBeInTheDocument();
    });

    // Start typing
    const guestsInput = screen.getByLabelText(/Guests/i);
    fireEvent.change(guestsInput, { target: { value: '3' } });

    // Error should disappear
    await waitFor(() => {
      expect(screen.queryByText(/Failed to load rooms/i)).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});

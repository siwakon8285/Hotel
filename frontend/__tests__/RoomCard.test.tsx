import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Room } from '@/types';

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

describe('RoomCard Price Formatting', () => {
  const createMockRoom = (basePrice: string): Room => ({
    id: "1",
    room_number: "101",
    status: "available",
    model_key: "key",
    room_type: {
      id: "1",
      name: "Test Room",
      base_price: basePrice,
      currency: "THB",
      max_guests: 2,
      bed_type: "King",
      room_size: 40,
    },
    floor: {
      id: "1",
      floor_number: 1,
      name: "Floor 1",
      description: "",
    },
    amenities: [],
  });

  it('formats "4500.00" to "THB 4,500"', () => {
    render(<RoomCard room={createMockRoom("4500.00")} />);
    expect(screen.getByText(/THB 4,500/i)).toBeInTheDocument();
  });

  it('formats "10500.00" to "THB 10,500"', () => {
    render(<RoomCard room={createMockRoom("10500.00")} />);
    expect(screen.getByText(/THB 10,500/i)).toBeInTheDocument();
  });

  it('formats "25000.00" to "THB 25,000"', () => {
    render(<RoomCard room={createMockRoom("25000.00")} />);
    expect(screen.getByText(/THB 25,000/i)).toBeInTheDocument();
  });
});

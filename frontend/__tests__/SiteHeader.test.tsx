import { render, screen } from '@testing-library/react';
import { SiteHeader } from '@/components/shared/SiteHeader';

describe('SiteHeader Component', () => {
  it('should render the brand name', () => {
    render(<SiteHeader />);
    expect(screen.getByText('AURORA GRAND')).toBeInTheDocument();
  });

  it('should render desktop navigation links', () => {
    render(<SiteHeader />);
    expect(screen.getByText('Hotel')).toBeInTheDocument();
    expect(screen.getByText('Rooms')).toBeInTheDocument();
  });

  it('should render the Book Now button', () => {
    render(<SiteHeader />);
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });
});

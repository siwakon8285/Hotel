import { render, screen } from '@testing-library/react';
import { AppShell } from '@/components/layout/AppShell';

// Mock SiteHeader and SiteFooter
jest.mock('@/components/shared/SiteHeader', () => ({
  SiteHeader: () => <header data-testid="site-header">Header</header>,
}));
jest.mock('@/components/home/SiteFooter', () => ({
  SiteFooter: () => <footer data-testid="site-footer">Footer</footer>,
}));

describe('AppShell', () => {
  it('renders SiteHeader and SiteFooter around children', () => {
    render(
      <AppShell>
        <div data-testid="page-content">Content</div>
      </AppShell>
    );
    
    expect(screen.getByTestId('site-header')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByTestId('site-footer')).toBeInTheDocument();
  });
});

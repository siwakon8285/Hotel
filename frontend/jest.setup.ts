import '@testing-library/jest-dom';

// Mock window.matchMedia for tests (used by useReducedMotion and GSAP matchMedia)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo for tests (used by GSAP ScrollTrigger)
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

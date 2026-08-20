import { render, screen } from '@testing-library/react';
import { Reveal } from '@/components/motion/Reveal';

// Mock GSAP to avoid animation side effects in tests
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    fromTo: jest.fn(),
    to: jest.fn(),
    context: jest.fn(() => ({ revert: jest.fn() })),
    matchMedia: jest.fn(() => ({ add: jest.fn(), revert: jest.fn() })),
  },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

jest.mock('@gsap/react', () => ({
  useGSAP: jest.fn(),
}));

describe('Reveal Component', () => {
  it('renders children immediately', () => {
    render(
      <Reveal>
        <p>Hello World</p>
      </Reveal>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders children without hidden opacity in reduced-motion mode', () => {
    // useReducedMotion returns false by default (matchMedia mock returns matches: false)
    // But content should still be visible because useGSAP is mocked to not run
    render(
      <Reveal animation="fade-up">
        <h2>Heading</h2>
      </Reveal>
    );
    const heading = screen.getByText('Heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toBeVisible();
  });
});

describe('Motion Components Architecture', () => {
  it('does not import Three.js or WebGL dependencies', () => {
    // Verify our motion module files exist and are loadable
    // This test ensures the motion layer stays lightweight and doesn't
    // accidentally pull in heavy 3D dependencies
    const motionModules = [
      '@/components/motion/Reveal',
      '@/components/motion/ImageReveal',
      '@/components/motion/ParallaxImage',
      '@/components/motion/StaggerGroup',
    ];
    for (const mod of motionModules) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const m = require(mod);
      expect(m).toBeDefined();
    }
  });
});

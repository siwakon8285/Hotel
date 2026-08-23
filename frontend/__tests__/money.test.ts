import { formatPrice } from '@/lib/money';

describe('money utilities', () => {
  describe('formatPrice', () => {
    it('formats exact integer string correctly', () => {
      expect(formatPrice('4500.00')).toBe('4,500');
      expect(formatPrice('10500.00')).toBe('10,500');
      expect(formatPrice('25000.00')).toBe('25,000');
    });

    it('handles strings without decimals gracefully', () => {
      expect(formatPrice('4500')).toBe('4,500');
    });

    it('returns 0 for empty or invalid strings', () => {
      expect(formatPrice('')).toBe('0');
      expect(formatPrice('invalid')).toBe('0');
    });
  });
});

/**
 * Formats a backend price string (e.g. "4500.00") into a formatted integer string (e.g. "4,500").
 * The backend price strings currently represent integral THB.
 * We extract the integer part by splitting on the decimal point to avoid floating-point math.
 */
export function formatPrice(backendPriceString: string): string {
  if (!backendPriceString) return "0";
  const parts = backendPriceString.split(".");
  const integerPart = parts[0];
  const parsed = parseInt(integerPart, 10);
  if (isNaN(parsed)) return "0";
  return new Intl.NumberFormat('en-US').format(parsed);
}

export const HOTEL_IMAGES = {
  hero: "/images/aurora-hotel-hero.png",
  intro: "/images/hotel-intro.jpg",
  gallery: {
    main: "/images/hotel-gallery-01.jpg",
    detail1: "/images/hotel-gallery-02.jpg",
    detail2: "/images/hotel-gallery-03.jpg",
  },
  rooms: {
    deluxe: "/images/room-deluxe.jpg",
    suite: "/images/room-suite.jpg",
  },
  signature: "/images/signature-experience.jpg",
  bookingCta: "/images/booking-cta.jpg"
};

export function getRoomTypeImage(roomTypeName: string): string {
  const name = roomTypeName.toLowerCase();
  if (name.includes('suite')) return HOTEL_IMAGES.rooms.suite;
  return HOTEL_IMAGES.rooms.deluxe;
}

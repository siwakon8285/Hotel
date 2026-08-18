export type Hotel = {
  id: string;
  name: string;
  slug: string;
  description: string;
  check_in_time: string;
  check_out_time: string;
};

export type Floor = {
  id: string;
  floor_number: number;
  name: string;
  description: string;
};

export type Amenity = {
  id: string;
  name: string;
  icon: string;
};

export type RoomType = {
  id: string;
  name: string;
  base_price: string;
  capacity: number;
};

export type Room = {
  id: string;
  room_number: string;
  status: 'available' | 'maintenance' | 'disabled';
  model_key: string;
  floor: Floor;
  room_type: RoomType;
  amenities: Amenity[];
};

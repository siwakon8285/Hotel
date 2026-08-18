package dtos

type HotelDTO struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Address     string `json:"address"`
	City        string `json:"city"`
	Country     string `json:"country"`
	Latitude    string `json:"latitude"`
	Longitude   string `json:"longitude"`
}

type HotelListResponse struct {
	Data []HotelDTO `json:"data"`
}

type HotelResponse struct {
	Data HotelDTO `json:"data"`
}

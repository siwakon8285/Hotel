package dtos

type FloorDTO struct {
	ID          string `json:"id"`
	FloorNumber int    `json:"floor_number"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type FloorListResponse struct {
	Data []FloorDTO `json:"data"`
}

type FloorResponse struct {
	Data FloorDTO `json:"data"`
}

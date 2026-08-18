package dtos

import (
	"fmt"

	"github.com/siwakon8285/Hotel/apps/api/internal/domain/entities"
)

type RoomTypeDTO struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	BasePrice   string `json:"base_price"`
	Currency    string `json:"currency"`
	MaxGuests   int    `json:"max_guests"`
	BedType     string `json:"bed_type"`
	RoomSize    int    `json:"room_size"`
}

type AmenityDTO struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Icon string `json:"icon"`
}

type RoomDTO struct {
	ID         string       `json:"id"`
	RoomNumber string       `json:"room_number"`
	Status     string       `json:"status"`
	ModelKey   string       `json:"model_key"`
	Floor      *FloorDTO    `json:"floor,omitempty"`
	RoomType   *RoomTypeDTO `json:"room_type,omitempty"`
	Amenities  []AmenityDTO `json:"amenities,omitempty"`
}

type RoomListResponse struct {
	Data []RoomDTO `json:"data"`
}

type RoomResponse struct {
	Data RoomDTO `json:"data"`
}

// FormatPrice formats satang to THB string
func FormatPrice(satang int64) string {
	return fmt.Sprintf("%.2f", float64(satang)/100.0)
}

func MapRoomType(rt *entities.RoomType) *RoomTypeDTO {
	if rt == nil {
		return nil
	}
	return &RoomTypeDTO{
		ID:          rt.ID.String(),
		Name:        rt.Name,
		Description: rt.Description,
		BasePrice:   FormatPrice(rt.BasePrice),
		Currency:    "THB",
		MaxGuests:   rt.MaxGuests,
		BedType:     rt.BedType,
		RoomSize:    rt.RoomSize,
	}
}

func MapAmenities(amenities []entities.Amenity) []AmenityDTO {
	var result []AmenityDTO
	for _, a := range amenities {
		result = append(result, AmenityDTO{
			ID:   a.ID.String(),
			Name: a.Name,
			Icon: a.Icon,
		})
	}
	return result
}

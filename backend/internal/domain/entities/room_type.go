package entities

import (
	"time"

	"github.com/google/uuid"
)

type RoomType struct {
	ID          uuid.UUID
	HotelID     uuid.UUID
	Name        string
	Description string
	BasePrice   int64 // Stored as satang
	MaxGuests   int
	BedType     string
	RoomSize    int
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

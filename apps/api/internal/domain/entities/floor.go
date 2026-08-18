package entities

import (
	"time"

	"github.com/google/uuid"
)

type Floor struct {
	ID          uuid.UUID
	HotelID     uuid.UUID
	FloorNumber int
	Name        string
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

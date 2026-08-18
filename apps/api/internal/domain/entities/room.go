package entities

import (
	"time"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/value_objects"
)

type Room struct {
	ID         uuid.UUID
	FloorID    uuid.UUID
	RoomTypeID uuid.UUID
	RoomNumber string
	Status     value_objects.RoomStatus
	ModelKey   string
	CreatedAt  time.Time
	UpdatedAt  time.Time

	// Relationships (Aggregates)
	Floor     *Floor
	RoomType  *RoomType
	Amenities []Amenity
}

package entities

import (
	"github.com/google/uuid"
)

type Amenity struct {
	ID   uuid.UUID
	Name string
	Icon string
}

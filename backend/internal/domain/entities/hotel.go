package entities

import (
	"time"

	"github.com/google/uuid"
)

type Hotel struct {
	ID          uuid.UUID
	Name        string
	Slug        string
	Description string
	Address     string
	City        string
	Country     string
	Latitude    string // Use string for numeric values to preserve precision if they don't participate in math
	Longitude   string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

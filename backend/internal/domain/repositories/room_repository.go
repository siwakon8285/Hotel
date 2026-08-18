package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/domain/entities"
)

type RoomSearchFilter struct {
	CheckIn  *string
	CheckOut *string
	Guests   *int
	RoomType *uuid.UUID
}

type RoomRepository interface {
	ListByFloorID(ctx context.Context, floorID uuid.UUID) ([]entities.Room, error)
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Room, error)
	Search(ctx context.Context, filter RoomSearchFilter) ([]entities.Room, error)
}

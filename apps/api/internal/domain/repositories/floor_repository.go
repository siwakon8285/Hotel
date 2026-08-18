package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/entities"
)

type FloorRepository interface {
	ListByHotelID(ctx context.Context, hotelID uuid.UUID) ([]entities.Floor, error)
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Floor, error)
}

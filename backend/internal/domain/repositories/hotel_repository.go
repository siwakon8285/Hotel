package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/domain/entities"
)

type HotelRepository interface {
	List(ctx context.Context) ([]entities.Hotel, error)
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Hotel, error)
}

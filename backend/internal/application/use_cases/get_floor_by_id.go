package use_cases

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/application/dtos"
	"github.com/siwakon8285/Hotel/backend/internal/domain/repositories"
)

type GetFloorByIDUseCase struct {
	floorRepo repositories.FloorRepository
}

func NewGetFloorByIDUseCase(floorRepo repositories.FloorRepository) *GetFloorByIDUseCase {
	return &GetFloorByIDUseCase{
		floorRepo: floorRepo,
	}
}

func (uc *GetFloorByIDUseCase) Execute(ctx context.Context, id uuid.UUID) (*dtos.FloorResponse, error) {
	f, err := uc.floorRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &dtos.FloorResponse{
		Data: dtos.FloorDTO{
			ID:          f.ID.String(),
			FloorNumber: f.FloorNumber,
			Name:        f.Name,
			Description: f.Description,
		},
	}, nil
}

package use_cases

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/application/dtos"
	"github.com/siwakon8285/Hotel/backend/internal/domain/repositories"
)

type GetFloorsUseCase struct {
	floorRepo repositories.FloorRepository
}

func NewGetFloorsUseCase(floorRepo repositories.FloorRepository) *GetFloorsUseCase {
	return &GetFloorsUseCase{
		floorRepo: floorRepo,
	}
}

func (uc *GetFloorsUseCase) Execute(ctx context.Context, hotelID uuid.UUID) (*dtos.FloorListResponse, error) {
	floors, err := uc.floorRepo.ListByHotelID(ctx, hotelID)
	if err != nil {
		return nil, err
	}

	var dtoList []dtos.FloorDTO
	for _, f := range floors {
		dtoList = append(dtoList, dtos.FloorDTO{
			ID:          f.ID.String(),
			FloorNumber: f.FloorNumber,
			Name:        f.Name,
			Description: f.Description,
		})
	}

	if dtoList == nil {
		dtoList = []dtos.FloorDTO{}
	}

	return &dtos.FloorListResponse{
		Data: dtoList,
	}, nil
}

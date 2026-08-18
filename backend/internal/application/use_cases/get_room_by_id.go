package use_cases

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/application/dtos"
	"github.com/siwakon8285/Hotel/backend/internal/domain/repositories"
)

type GetRoomByIDUseCase struct {
	roomRepo repositories.RoomRepository
}

func NewGetRoomByIDUseCase(roomRepo repositories.RoomRepository) *GetRoomByIDUseCase {
	return &GetRoomByIDUseCase{
		roomRepo: roomRepo,
	}
}

func (uc *GetRoomByIDUseCase) Execute(ctx context.Context, id uuid.UUID) (*dtos.RoomResponse, error) {
	r, err := uc.roomRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	var fDto *dtos.FloorDTO
	if r.Floor != nil {
		fDto = &dtos.FloorDTO{
			ID:          r.Floor.ID.String(),
			FloorNumber: r.Floor.FloorNumber,
			Name:        r.Floor.Name,
			Description: r.Floor.Description,
		}
	}

	var rtDto *dtos.RoomTypeDTO
	if r.RoomType != nil {
		rtDto = dtos.MapRoomType(r.RoomType)
	}

	var amDto []dtos.AmenityDTO
	if r.Amenities != nil {
		amDto = dtos.MapAmenities(r.Amenities)
	}

	return &dtos.RoomResponse{
		Data: dtos.RoomDTO{
			ID:         r.ID.String(),
			RoomNumber: r.RoomNumber,
			Status:     r.Status.String(),
			ModelKey:   r.ModelKey,
			Floor:      fDto,
			RoomType:   rtDto,
			Amenities:  amDto,
		},
	}, nil
}

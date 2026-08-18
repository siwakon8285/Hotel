package use_cases

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/application/dtos"
	"github.com/siwakon8285/Hotel/backend/internal/domain/repositories"
)

type GetRoomsUseCase struct {
	roomRepo repositories.RoomRepository
}

func NewGetRoomsUseCase(roomRepo repositories.RoomRepository) *GetRoomsUseCase {
	return &GetRoomsUseCase{
		roomRepo: roomRepo,
	}
}

func (uc *GetRoomsUseCase) Execute(ctx context.Context, floorID uuid.UUID) (*dtos.RoomListResponse, error) {
	rooms, err := uc.roomRepo.ListByFloorID(ctx, floorID)
	if err != nil {
		return nil, err
	}

	var dtoList []dtos.RoomDTO
	for _, r := range rooms {
		var rtDto *dtos.RoomTypeDTO
		if r.RoomType != nil {
			rtDto = dtos.MapRoomType(r.RoomType)
		}

		var amDto []dtos.AmenityDTO
		if r.Amenities != nil {
			amDto = dtos.MapAmenities(r.Amenities)
		}

		dtoList = append(dtoList, dtos.RoomDTO{
			ID:         r.ID.String(),
			RoomNumber: r.RoomNumber,
			Status:     r.Status.String(),
			ModelKey:   r.ModelKey,
			RoomType:   rtDto,
			Amenities:  amDto,
		})
	}

	if dtoList == nil {
		dtoList = []dtos.RoomDTO{}
	}

	return &dtos.RoomListResponse{
		Data: dtoList,
	}, nil
}

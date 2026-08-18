package use_cases

import (
	"context"

	"github.com/siwakon8285/Hotel/apps/api/internal/application"
	"github.com/siwakon8285/Hotel/apps/api/internal/application/dtos"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
)

type SearchRoomsUseCase struct {
	roomRepo repositories.RoomRepository
}

func NewSearchRoomsUseCase(roomRepo repositories.RoomRepository) *SearchRoomsUseCase {
	return &SearchRoomsUseCase{
		roomRepo: roomRepo,
	}
}

func (uc *SearchRoomsUseCase) Execute(ctx context.Context, filter repositories.RoomSearchFilter) (*dtos.RoomListResponse, error) {
	// Domain Validation
	if (filter.CheckIn != nil && filter.CheckOut == nil) || (filter.CheckIn == nil && filter.CheckOut != nil) {
		return nil, application.ErrInvalidInput
	}

	if filter.Guests != nil && *filter.Guests <= 0 {
		return nil, application.ErrInvalidInput
	}

	rooms, err := uc.roomRepo.Search(ctx, filter)
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

		// Search generally returns rooms with basic + type + amenities
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

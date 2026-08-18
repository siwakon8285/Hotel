package use_cases

import (
	"context"

	"github.com/siwakon8285/Hotel/backend/internal/application/dtos"
	"github.com/siwakon8285/Hotel/backend/internal/domain/repositories"
)

type GetHotelsUseCase struct {
	hotelRepo repositories.HotelRepository
}

func NewGetHotelsUseCase(hotelRepo repositories.HotelRepository) *GetHotelsUseCase {
	return &GetHotelsUseCase{
		hotelRepo: hotelRepo,
	}
}

func (uc *GetHotelsUseCase) Execute(ctx context.Context) (*dtos.HotelListResponse, error) {
	hotels, err := uc.hotelRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	var dtoList []dtos.HotelDTO
	for _, h := range hotels {
		dtoList = append(dtoList, dtos.HotelDTO{
			ID:          h.ID.String(),
			Name:        h.Name,
			Slug:        h.Slug,
			Description: h.Description,
			Address:     h.Address,
			City:        h.City,
			Country:     h.Country,
			Latitude:    h.Latitude,
			Longitude:   h.Longitude,
		})
	}

	if dtoList == nil {
		dtoList = []dtos.HotelDTO{}
	}

	return &dtos.HotelListResponse{
		Data: dtoList,
	}, nil
}

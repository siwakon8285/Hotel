package use_cases

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/apps/api/internal/application/dtos"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
)

type GetHotelByIDUseCase struct {
	hotelRepo repositories.HotelRepository
}

func NewGetHotelByIDUseCase(hotelRepo repositories.HotelRepository) *GetHotelByIDUseCase {
	return &GetHotelByIDUseCase{
		hotelRepo: hotelRepo,
	}
}

func (uc *GetHotelByIDUseCase) Execute(ctx context.Context, id uuid.UUID) (*dtos.HotelResponse, error) {
	h, err := uc.hotelRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &dtos.HotelResponse{
		Data: dtos.HotelDTO{
			ID:          h.ID.String(),
			Name:        h.Name,
			Slug:        h.Slug,
			Description: h.Description,
			Address:     h.Address,
			City:        h.City,
			Country:     h.Country,
			Latitude:    h.Latitude,
			Longitude:   h.Longitude,
		},
	}, nil
}

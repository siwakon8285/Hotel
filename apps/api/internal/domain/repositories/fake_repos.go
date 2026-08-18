package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/apps/api/internal/application"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/entities"
)

type FakeHotelRepository struct {
	Hotels []entities.Hotel
}

func (f *FakeHotelRepository) List(ctx context.Context) ([]entities.Hotel, error) {
	return f.Hotels, nil
}

func (f *FakeHotelRepository) GetByID(ctx context.Context, id uuid.UUID) (*entities.Hotel, error) {
	for _, h := range f.Hotels {
		if h.ID == id {
			return &h, nil
		}
	}
	return nil, application.ErrNotFound
}

type FakeRoomRepository struct {
	Rooms []entities.Room
}

func (f *FakeRoomRepository) ListByFloorID(ctx context.Context, floorID uuid.UUID) ([]entities.Room, error) {
	var result []entities.Room
	for _, r := range f.Rooms {
		if r.FloorID == floorID {
			result = append(result, r)
		}
	}
	return result, nil
}

func (f *FakeRoomRepository) GetByID(ctx context.Context, id uuid.UUID) (*entities.Room, error) {
	for _, r := range f.Rooms {
		if r.ID == id {
			return &r, nil
		}
	}
	return nil, application.ErrNotFound
}

func (f *FakeRoomRepository) Search(ctx context.Context, filter RoomSearchFilter) ([]entities.Room, error) {
	return f.Rooms, nil // Simplified for testing basic handler flow
}

type FakeFloorRepository struct {
	Floors []entities.Floor
}

func (f *FakeFloorRepository) ListByHotelID(ctx context.Context, hotelID uuid.UUID) ([]entities.Floor, error) {
	var result []entities.Floor
	for _, fl := range f.Floors {
		if fl.HotelID == hotelID {
			result = append(result, fl)
		}
	}
	return result, nil
}

func (f *FakeFloorRepository) GetByID(ctx context.Context, id uuid.UUID) (*entities.Floor, error) {
	for _, fl := range f.Floors {
		if fl.ID == id {
			return &fl, nil
		}
	}
	return nil, application.ErrNotFound
}

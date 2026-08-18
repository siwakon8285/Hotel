package use_cases_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/apps/api/internal/application"
	"github.com/siwakon8285/Hotel/apps/api/internal/application/use_cases"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/entities"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
)

func TestGetHotelsUseCase(t *testing.T) {
	fakeRepo := &repositories.FakeHotelRepository{
		Hotels: []entities.Hotel{
			{ID: uuid.New(), Name: "Test Hotel"},
		},
	}
	uc := use_cases.NewGetHotelsUseCase(fakeRepo)

	resp, err := uc.Execute(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if len(resp.Data) != 1 {
		t.Errorf("expected 1 hotel, got %d", len(resp.Data))
	}
	if resp.Data[0].Name != "Test Hotel" {
		t.Errorf("expected 'Test Hotel', got %s", resp.Data[0].Name)
	}
}

func TestGetHotelByIDUseCase_NotFound(t *testing.T) {
	fakeRepo := &repositories.FakeHotelRepository{}
	uc := use_cases.NewGetHotelByIDUseCase(fakeRepo)

	_, err := uc.Execute(context.Background(), uuid.New())
	if err != application.ErrNotFound {
		t.Fatalf("expected ErrNotFound, got %v", err)
	}
}

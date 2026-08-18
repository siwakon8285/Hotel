package use_cases_test

import (
	"context"
	"testing"

	"github.com/siwakon8285/Hotel/apps/api/internal/application"
	"github.com/siwakon8285/Hotel/apps/api/internal/application/use_cases"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
)

func TestSearchRoomsUseCase_Validation(t *testing.T) {
	fakeRepo := &repositories.FakeRoomRepository{}
	uc := use_cases.NewSearchRoomsUseCase(fakeRepo)

	// Test: Only check_in provided
	checkIn := "2026-09-01"
	_, err := uc.Execute(context.Background(), repositories.RoomSearchFilter{
		CheckIn: &checkIn,
	})
	if err != application.ErrInvalidInput {
		t.Errorf("expected ErrInvalidInput for missing check_out, got %v", err)
	}

	// Test: Invalid guests
	guests := -1
	_, err = uc.Execute(context.Background(), repositories.RoomSearchFilter{
		Guests: &guests,
	})
	if err != application.ErrInvalidInput {
		t.Errorf("expected ErrInvalidInput for negative guests, got %v", err)
	}
}

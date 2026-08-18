package handlers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/apps/api/internal/application/dtos"
	"github.com/siwakon8285/Hotel/apps/api/internal/application/use_cases"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/entities"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
	"github.com/siwakon8285/Hotel/apps/api/internal/infrastructure/http/handlers"
)

func TestHotelHandler_GetHotels(t *testing.T) {
	fakeRepo := &repositories.FakeHotelRepository{
		Hotels: []entities.Hotel{
			{ID: uuid.New(), Name: "Test Hotel"},
		},
	}
	getHotelsUC := use_cases.NewGetHotelsUseCase(fakeRepo)
	h := handlers.NewHotelHandler(getHotelsUC, nil, nil)

	r := chi.NewRouter()
	r.Get("/hotels", h.GetHotels)

	req := httptest.NewRequest("GET", "/hotels", nil)
	rr := httptest.NewRecorder()

	r.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", rr.Code)
	}

	var resp dtos.HotelListResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatal(err)
	}
	if len(resp.Data) != 1 {
		t.Errorf("expected 1 hotel, got %d", len(resp.Data))
	}
}

func TestHotelHandler_GetHotelByID_NotFound(t *testing.T) {
	fakeRepo := &repositories.FakeHotelRepository{}
	getHotelByIDUC := use_cases.NewGetHotelByIDUseCase(fakeRepo)
	h := handlers.NewHotelHandler(nil, getHotelByIDUC, nil)

	r := chi.NewRouter()
	r.Get("/hotels/{hotelId}", h.GetHotelByID)

	req := httptest.NewRequest("GET", "/hotels/"+uuid.New().String(), nil)
	rr := httptest.NewRecorder()

	r.ServeHTTP(rr, req)

	if rr.Code != http.StatusNotFound {
		t.Errorf("expected status 404, got %d", rr.Code)
	}
}

func TestHotelHandler_GetHotelByID_InvalidUUID(t *testing.T) {
	h := handlers.NewHotelHandler(nil, nil, nil)

	r := chi.NewRouter()
	r.Get("/hotels/{hotelId}", h.GetHotelByID)

	req := httptest.NewRequest("GET", "/hotels/invalid-id", nil)
	rr := httptest.NewRecorder()

	r.ServeHTTP(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", rr.Code)
	}
}

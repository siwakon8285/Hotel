package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/application/use_cases"
)

type HotelHandler struct {
	getHotelsUseCase    *use_cases.GetHotelsUseCase
	getHotelByIDUseCase *use_cases.GetHotelByIDUseCase
	getFloorsUseCase    *use_cases.GetFloorsUseCase
}

func NewHotelHandler(getHotels *use_cases.GetHotelsUseCase, getHotelByID *use_cases.GetHotelByIDUseCase, getFloors *use_cases.GetFloorsUseCase) *HotelHandler {
	return &HotelHandler{
		getHotelsUseCase:    getHotels,
		getHotelByIDUseCase: getHotelByID,
		getFloorsUseCase:    getFloors,
	}
}

func (h *HotelHandler) GetHotels(w http.ResponseWriter, r *http.Request) {
	resp, err := h.getHotelsUseCase.Execute(r.Context())
	if err != nil {
		HandleAppError(w, err)
		return
	}
	WriteJSON(w, http.StatusOK, resp)
}

func (h *HotelHandler) GetHotelByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "hotelId")
	id, err := uuid.Parse(idStr)
	if err != nil {
		WriteError(w, http.StatusBadRequest, "INVALID_ID", "Invalid hotel ID format")
		return
	}

	resp, err := h.getHotelByIDUseCase.Execute(r.Context(), id)
	if err != nil {
		HandleAppError(w, err)
		return
	}
	WriteJSON(w, http.StatusOK, resp)
}

func (h *HotelHandler) GetHotelFloors(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "hotelId")
	id, err := uuid.Parse(idStr)
	if err != nil {
		WriteError(w, http.StatusBadRequest, "INVALID_ID", "Invalid hotel ID format")
		return
	}

	resp, err := h.getFloorsUseCase.Execute(r.Context(), id)
	if err != nil {
		HandleAppError(w, err)
		return
	}
	WriteJSON(w, http.StatusOK, resp)
}

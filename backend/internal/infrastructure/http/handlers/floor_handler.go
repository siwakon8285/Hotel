package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/backend/internal/application/use_cases"
)

type FloorHandler struct {
	getFloorByIDUseCase *use_cases.GetFloorByIDUseCase
	getRoomsUseCase     *use_cases.GetRoomsUseCase
}

func NewFloorHandler(getFloorByID *use_cases.GetFloorByIDUseCase, getRooms *use_cases.GetRoomsUseCase) *FloorHandler {
	return &FloorHandler{
		getFloorByIDUseCase: getFloorByID,
		getRoomsUseCase:     getRooms,
	}
}

func (h *FloorHandler) GetFloorByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "floorId")
	id, err := uuid.Parse(idStr)
	if err != nil {
		WriteError(w, http.StatusBadRequest, "INVALID_ID", "Invalid floor ID format")
		return
	}

	resp, err := h.getFloorByIDUseCase.Execute(r.Context(), id)
	if err != nil {
		HandleAppError(w, err)
		return
	}
	WriteJSON(w, http.StatusOK, resp)
}

func (h *FloorHandler) GetFloorRooms(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "floorId")
	id, err := uuid.Parse(idStr)
	if err != nil {
		WriteError(w, http.StatusBadRequest, "INVALID_ID", "Invalid floor ID format")
		return
	}

	resp, err := h.getRoomsUseCase.Execute(r.Context(), id)
	if err != nil {
		HandleAppError(w, err)
		return
	}
	WriteJSON(w, http.StatusOK, resp)
}

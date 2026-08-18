package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/siwakon8285/Hotel/apps/api/internal/application/use_cases"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
)

type RoomHandler struct {
	getRoomByIDUseCase *use_cases.GetRoomByIDUseCase
	searchRoomsUseCase *use_cases.SearchRoomsUseCase
}

func NewRoomHandler(getRoomByID *use_cases.GetRoomByIDUseCase, searchRooms *use_cases.SearchRoomsUseCase) *RoomHandler {
	return &RoomHandler{
		getRoomByIDUseCase: getRoomByID,
		searchRoomsUseCase: searchRooms,
	}
}

func (h *RoomHandler) GetRoomByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "roomId")
	id, err := uuid.Parse(idStr)
	if err != nil {
		WriteError(w, http.StatusBadRequest, "INVALID_ID", "Invalid room ID format")
		return
	}

	resp, err := h.getRoomByIDUseCase.Execute(r.Context(), id)
	if err != nil {
		HandleAppError(w, err)
		return
	}
	WriteJSON(w, http.StatusOK, resp)
}

func (h *RoomHandler) SearchRooms(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()

	var filter repositories.RoomSearchFilter

	if checkInStr := q.Get("check_in"); checkInStr != "" {
		if _, err := time.Parse("2006-01-02", checkInStr); err != nil {
			WriteError(w, http.StatusBadRequest, "INVALID_DATE", "check_in must be YYYY-MM-DD")
			return
		}
		filter.CheckIn = &checkInStr
	}

	if checkOutStr := q.Get("check_out"); checkOutStr != "" {
		if _, err := time.Parse("2006-01-02", checkOutStr); err != nil {
			WriteError(w, http.StatusBadRequest, "INVALID_DATE", "check_out must be YYYY-MM-DD")
			return
		}
		filter.CheckOut = &checkOutStr
	}

	if (filter.CheckIn != nil && filter.CheckOut == nil) || (filter.CheckIn == nil && filter.CheckOut != nil) {
		WriteError(w, http.StatusBadRequest, "INVALID_QUERY", "Both check_in and check_out must be provided together")
		return
	}

	if filter.CheckIn != nil && filter.CheckOut != nil {
		if *filter.CheckOut <= *filter.CheckIn {
			WriteError(w, http.StatusBadRequest, "INVALID_DATE_RANGE", "check_out must be after check_in")
			return
		}
	}

	if guestsStr := q.Get("guests"); guestsStr != "" {
		guests, err := strconv.Atoi(guestsStr)
		if err != nil || guests <= 0 {
			WriteError(w, http.StatusBadRequest, "INVALID_GUESTS", "guests must be a positive integer")
			return
		}
		filter.Guests = &guests
	}

	if rtStr := q.Get("room_type"); rtStr != "" {
		rtID, err := uuid.Parse(rtStr)
		if err != nil {
			WriteError(w, http.StatusBadRequest, "INVALID_ROOM_TYPE", "room_type must be a valid UUID")
			return
		}
		filter.RoomType = &rtID
	}

	resp, err := h.searchRoomsUseCase.Execute(r.Context(), filter)
	if err != nil {
		HandleAppError(w, err)
		return
	}
	WriteJSON(w, http.StatusOK, resp)
}

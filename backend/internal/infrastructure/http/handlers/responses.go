package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/siwakon8285/Hotel/backend/internal/application"
)

type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

type ErrorDetail struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func WriteJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}

func WriteError(w http.ResponseWriter, status int, code, message string) {
	WriteJSON(w, status, ErrorResponse{
		Error: ErrorDetail{
			Code:    code,
			Message: message,
		},
	})
}

func HandleAppError(w http.ResponseWriter, err error) {
	switch {
	case err == application.ErrNotFound:
		WriteError(w, http.StatusNotFound, "NOT_FOUND", "Resource not found")
	case err == application.ErrInvalidInput:
		WriteError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid input parameters")
	default:
		WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "An unexpected error occurred")
	}
}

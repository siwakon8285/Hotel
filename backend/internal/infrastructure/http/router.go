package http

import (
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/siwakon8285/Hotel/backend/internal/application/use_cases"
	"github.com/siwakon8285/Hotel/backend/internal/infrastructure/database/repositories"
	"github.com/siwakon8285/Hotel/backend/internal/infrastructure/http/handlers"
)

func NewRouter(pool *pgxpool.Pool) chi.Router {
	r := chi.NewRouter()

	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)

	// Limit request size to 1MB
	r.Use(chimiddleware.RequestSize(1 << 20))

	// CORS for Next.js frontend
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(chimiddleware.Heartbeat("/ping"))

	healthHandler := handlers.NewHealthHandler(pool)
	r.Route("/health", func(r chi.Router) {
		r.Get("/live", healthHandler.Live)
		r.Get("/ready", healthHandler.Ready)
	})

	// Setup Repositories
	hotelRepo := repositories.NewHotelRepository(pool)
	floorRepo := repositories.NewFloorRepository(pool)
	roomRepo := repositories.NewRoomRepository(pool)

	// Setup Use Cases
	getHotels := use_cases.NewGetHotelsUseCase(hotelRepo)
	getHotelByID := use_cases.NewGetHotelByIDUseCase(hotelRepo)
	getFloors := use_cases.NewGetFloorsUseCase(floorRepo)
	getFloorByID := use_cases.NewGetFloorByIDUseCase(floorRepo)
	getRooms := use_cases.NewGetRoomsUseCase(roomRepo)
	getRoomByID := use_cases.NewGetRoomByIDUseCase(roomRepo)
	searchRooms := use_cases.NewSearchRoomsUseCase(roomRepo)

	// Setup Handlers
	hotelHandler := handlers.NewHotelHandler(getHotels, getHotelByID, getFloors)
	floorHandler := handlers.NewFloorHandler(getFloorByID, getRooms)
	roomHandler := handlers.NewRoomHandler(getRoomByID, searchRooms)

	// API v1 Routes
	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/hotels", func(r chi.Router) {
			r.Get("/", hotelHandler.GetHotels)
			r.Get("/{hotelId}", hotelHandler.GetHotelByID)
			r.Get("/{hotelId}/floors", hotelHandler.GetHotelFloors)
		})

		r.Route("/floors", func(r chi.Router) {
			r.Get("/{floorId}", floorHandler.GetFloorByID)
			r.Get("/{floorId}/rooms", floorHandler.GetFloorRooms)
		})

		r.Route("/rooms", func(r chi.Router) {
			r.Get("/search", roomHandler.SearchRooms)
			r.Get("/{roomId}", roomHandler.GetRoomByID)
		})
	})

	return r
}

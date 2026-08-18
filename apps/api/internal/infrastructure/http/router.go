package http

import (
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/siwakon8285/Hotel/apps/api/internal/infrastructure/http/handlers"
)

// NewRouter สร้าง Chi router พร้อม middleware พื้นฐานและ health endpoints
// แยก route definitions ออกจาก main.go เพื่อความสะอาด
func NewRouter(pool *pgxpool.Pool) chi.Router {
	r := chi.NewRouter()

	// Middleware พื้นฐาน
	r.Use(chimiddleware.RequestID)          // สร้าง unique request ID สำหรับ tracing
	r.Use(chimiddleware.RealIP)             // ดึง IP จริงจาก proxy headers
	r.Use(chimiddleware.Logger)             // log ทุก request (method, path, status, duration)
	r.Use(chimiddleware.Recoverer)          // ดัก panic แล้ว return 500 แทนที่จะ crash server
	r.Use(chimiddleware.Heartbeat("/ping")) // endpoint สำหรับ simple ping

	// Health check endpoints — แยก liveness กับ readiness
	healthHandler := handlers.NewHealthHandler(pool)
	r.Route("/health", func(r chi.Router) {
		r.Get("/live", healthHandler.Live)   // liveness — ไม่เช็ค DB
		r.Get("/ready", healthHandler.Ready) // readiness — เช็ค PostgreSQL connection
	})

	return r
}

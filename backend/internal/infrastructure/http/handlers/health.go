package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/siwakon8285/Hotel/backend/internal/infrastructure/database"
)

// HealthHandler จัดการ health check endpoints
// แยก liveness กับ readiness เพื่อรองรับ Docker/K8s probe ที่แม่นยำ
type HealthHandler struct {
	pool *pgxpool.Pool
}

// healthResponse โครงสร้าง JSON response สำหรับ health check
type healthResponse struct {
	Status string `json:"status"`
}

// NewHealthHandler สร้าง handler พร้อม database pool สำหรับ readiness check
func NewHealthHandler(pool *pgxpool.Pool) *HealthHandler {
	return &HealthHandler{pool: pool}
}

// Live ตรวจสอบว่า API process ยังทำงานอยู่
// ไม่ตรวจ dependency ใดๆ — ถ้า handler ถูกเรียกได้ แปลว่า server ยังมีชีวิต
func (h *HealthHandler) Live(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, healthResponse{Status: "ok"})
}

// Ready ตรวจสอบว่า API พร้อมรับ request จริงหรือไม่
// ตรวจ PostgreSQL connection — ถ้าเชื่อมต่อไม่ได้จะตอบ 503
// ไม่เปิดเผย error detail หรือ connection string ให้ client
func (h *HealthHandler) Ready(w http.ResponseWriter, r *http.Request) {
	if err := database.Ping(r.Context(), h.pool); err != nil {
		writeJSON(w, http.StatusServiceUnavailable, healthResponse{Status: "not_ready"})
		return
	}

	writeJSON(w, http.StatusOK, healthResponse{Status: "ready"})
}

// PingDB ใช้สำหรับ test — ให้เข้าถึง pool.Ping() โดยตรง
func (h *HealthHandler) PingDB(ctx context.Context) error {
	return database.Ping(ctx, h.pool)
}

// writeJSON เขียน JSON response พร้อม Content-Type header
func writeJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

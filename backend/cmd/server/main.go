package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/siwakon8285/Hotel/backend/internal/config"
	"github.com/siwakon8285/Hotel/backend/internal/infrastructure/database"
	apphttp "github.com/siwakon8285/Hotel/backend/internal/infrastructure/http"
)

func main() {
	// โหลด configuration จาก environment variables
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("❌ โหลด configuration ไม่สำเร็จ: %v", err)
	}

	log.Printf("🚀 เริ่มต้น Aurora Grand Hotel API [env=%s]", cfg.App.Env)

	// สร้าง context หลักสำหรับ application lifecycle
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// เชื่อมต่อ PostgreSQL — ใช้ pgxpool สำหรับ connection pooling
	log.Println("📦 กำลังเชื่อมต่อ PostgreSQL...")
	pool, err := database.NewPool(ctx, cfg.Database.URL)
	if err != nil {
		log.Fatalf("❌ เชื่อมต่อ database ไม่สำเร็จ: %v", err)
	}
	defer pool.Close()
	log.Println("✅ เชื่อมต่อ PostgreSQL สำเร็จ")

	// สร้าง HTTP router พร้อม health endpoints
	router := apphttp.NewRouter(pool)

	// ตั้งค่า HTTP server พร้อม timeout ที่เหมาะสม
	server := &http.Server{
		Addr:         cfg.App.Address(),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// เริ่ม server ใน goroutine แยก เพื่อให้ main goroutine จัดการ shutdown
	go func() {
		log.Printf("🌐 HTTP server กำลังฟังที่ %s", cfg.App.Address())
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("❌ HTTP server error: %v", err)
		}
	}()

	// Graceful shutdown — รอ SIGINT หรือ SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	log.Printf("🛑 ได้รับสัญญาณ %v กำลัง shutdown...", sig)

	// ให้เวลา 10 วินาทีสำหรับ graceful shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	// ปิด HTTP server ก่อน — หยุดรับ request ใหม่
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("⚠️ HTTP server shutdown error: %v", err)
	}

	// ปิด database pool
	pool.Close()
	log.Println("✅ Shutdown เสร็จสมบูรณ์")
}

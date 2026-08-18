package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewPool สร้าง PostgreSQL connection pool จาก DATABASE_URL
// ใช้ pgxpool สำหรับ connection pooling ที่มีประสิทธิภาพ
// คืน error ถ้าเชื่อมต่อไม่ได้ โดยไม่เปิดเผย connection string ใน error message
func NewPool(ctx context.Context, databaseURL string) (*pgxpool.Pool, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("ไม่สามารถ parse database config: %w", err)
	}

	// ตั้งค่า connection pool — เหมาะสำหรับ development
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = 30 * time.Minute
	config.MaxConnIdleTime = 5 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("ไม่สามารถสร้าง database pool: %w", err)
	}

	// ทดสอบ connection ทันทีหลังสร้าง pool
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("ไม่สามารถเชื่อมต่อ database: %w", err)
	}

	return pool, nil
}

// Ping ตรวจสอบว่า database ยังตอบสนองอยู่
// ใช้สำหรับ readiness health check โดยมี timeout ป้องกันการค้าง
func Ping(ctx context.Context, pool *pgxpool.Pool) error {
	// ตั้ง timeout 3 วินาที สำหรับ health check
	pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	return pool.Ping(pingCtx)
}

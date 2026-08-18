package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config เก็บค่า configuration ทั้งหมดของแอปพลิเคชัน
// อ่านจาก environment variables ที่จุดเดียว ห้ามเรียก os.Getenv() กระจายในส่วนอื่น
type Config struct {
	App      AppConfig
	Database DatabaseConfig
}

// AppConfig เก็บค่า configuration ของ HTTP server
type AppConfig struct {
	Env  string // development, staging, production
	Port int
}

// DatabaseConfig เก็บค่า connection string สำหรับ PostgreSQL
type DatabaseConfig struct {
	URL     string // DATABASE_URL สำหรับ primary database
	TestURL string // TEST_DATABASE_URL สำหรับ test database (แยกจาก dev)
}

// Load อ่าน environment variables และสร้าง Config struct
// คืน error ถ้า required variables ขาดหายหรือค่าไม่ถูกต้อง
// ไม่ log ค่า secret เช่น DATABASE_URL เพื่อความปลอดภัย
func Load() (*Config, error) {
	// โหลด .env ถ้ามี (ส่วนใหญ่ใช้ใน local development)
	// ถ้าไม่มีไฟล์ หรือไม่ได้รันจาก apps/api ก็จะไม่เป็นไร (พึ่งพา OS env แทน)
	_ = godotenv.Load("../../.env")
	_ = godotenv.Load()

	// อ่าน APP_ENV — default เป็น development สำหรับ local dev
	appEnv := getEnvOrDefault("APP_ENV", "development")

	// อ่าน API_PORT — default เป็น 8080
	portStr := getEnvOrDefault("API_PORT", "8080")
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("API_PORT ต้องเป็นตัวเลข: %w", err)
	}

	// DATABASE_URL เป็น required — ห้ามรันโดยไม่ระบุ
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL จำเป็นต้องกำหนด")
	}

	// TEST_DATABASE_URL เป็น optional — ใช้สำหรับ test เท่านั้น
	testDatabaseURL := os.Getenv("TEST_DATABASE_URL")

	return &Config{
		App: AppConfig{
			Env:  appEnv,
			Port: port,
		},
		Database: DatabaseConfig{
			URL:     databaseURL,
			TestURL: testDatabaseURL,
		},
	}, nil
}

// Address คืน address สำหรับ HTTP server ในรูปแบบ ":port"
func (c *AppConfig) Address() string {
	return fmt.Sprintf(":%d", c.Port)
}

// IsDevelopment ตรวจสอบว่าอยู่ใน development mode หรือไม่
func (c *AppConfig) IsDevelopment() bool {
	return c.Env == "development"
}

// getEnvOrDefault อ่าน environment variable ถ้าไม่มีจะใช้ค่า default
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

package config

import (
	"os"
	"testing"
)

func TestLoad_Success(t *testing.T) {
	// ตั้ง environment variables ที่จำเป็นสำหรับ test
	t.Setenv("DATABASE_URL", "postgres://test:test@localhost:5432/testdb?sslmode=disable")
	t.Setenv("API_PORT", "9090")
	t.Setenv("APP_ENV", "testing")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() ควรสำเร็จ แต่ได้ error: %v", err)
	}

	if cfg.App.Port != 9090 {
		t.Errorf("API_PORT ควรเป็น 9090 แต่ได้ %d", cfg.App.Port)
	}

	if cfg.App.Env != "testing" {
		t.Errorf("APP_ENV ควรเป็น testing แต่ได้ %s", cfg.App.Env)
	}

	if cfg.Database.URL == "" {
		t.Error("DATABASE_URL ไม่ควรว่าง")
	}
}

func TestLoad_MissingDatabaseURL(t *testing.T) {
	// ลบ DATABASE_URL ออก เพื่อทดสอบว่า validation ทำงาน
	os.Unsetenv("DATABASE_URL")

	_, err := Load()
	if err == nil {
		t.Fatal("Load() ควร error เมื่อไม่มี DATABASE_URL")
	}
}

func TestLoad_InvalidPort(t *testing.T) {
	// ตั้ง port เป็นค่าที่ไม่ใช่ตัวเลข
	t.Setenv("DATABASE_URL", "postgres://test:test@localhost:5432/testdb")
	t.Setenv("API_PORT", "not-a-number")

	_, err := Load()
	if err == nil {
		t.Fatal("Load() ควร error เมื่อ API_PORT ไม่ใช่ตัวเลข")
	}
}

func TestLoad_DefaultValues(t *testing.T) {
	// ตั้งแค่ DATABASE_URL เพื่อทดสอบค่า default ของ port และ env
	t.Setenv("DATABASE_URL", "postgres://test:test@localhost:5432/testdb")
	os.Unsetenv("API_PORT")
	os.Unsetenv("APP_ENV")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() ควรสำเร็จ แต่ได้ error: %v", err)
	}

	if cfg.App.Port != 8080 {
		t.Errorf("default API_PORT ควรเป็น 8080 แต่ได้ %d", cfg.App.Port)
	}

	if cfg.App.Env != "development" {
		t.Errorf("default APP_ENV ควรเป็น development แต่ได้ %s", cfg.App.Env)
	}
}

func TestAppConfig_Address(t *testing.T) {
	app := AppConfig{Port: 8080}
	if app.Address() != ":8080" {
		t.Errorf("Address() ควรเป็น :8080 แต่ได้ %s", app.Address())
	}
}

func TestAppConfig_IsDevelopment(t *testing.T) {
	dev := AppConfig{Env: "development"}
	if !dev.IsDevelopment() {
		t.Error("IsDevelopment() ควรเป็น true สำหรับ development")
	}

	prod := AppConfig{Env: "production"}
	if prod.IsDevelopment() {
		t.Error("IsDevelopment() ควรเป็น false สำหรับ production")
	}
}

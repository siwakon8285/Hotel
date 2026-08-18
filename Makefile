-include .env
export

.PHONY: help dev build db-up db-down db-create-test db-setup db-backup db-restore migrate-up migrate-down test vet format tidy

# ==============================================================================
# Aurora Grand Hotel — Development Commands
# ==============================================================================

help: ## แสดงคำอธิบายคำสั่งทั้งหมด
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# --- Development ---

dev: ## รัน Go API locally บนเครื่อง (รอ Database พร้อมก่อน)
	cd apps/api && go run ./cmd/server

build: ## Build Go API binary สำหรับตรวจสอบ
	cd apps/api && go build -o bin/server ./cmd/server

# --- Database ---

db-up: ## เริ่มเฉพาะ PostgreSQL service ใน background
	docker compose up -d

db-down: ## หยุด database service (ไม่ลบ volume)
	docker compose stop db

db-create-test: ## สร้าง Test Database ถ้ายังไม่มี (Idempotent)
	@echo "⏳ Checking/Creating test database..."
	@docker compose exec -T db psql -U $(POSTGRES_USER) -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'hotel_booking_test'" | grep -q 1 || docker compose exec -T db psql -U $(POSTGRES_USER) -d postgres -c "CREATE DATABASE hotel_booking_test"
	@echo "✅ Test database ready"

db-setup: db-up ## Start DB and create test database
	@echo "⏳ Waiting for database to be ready..."
	@sleep 3
	@$(MAKE) db-create-test

db-backup: ## สำรองข้อมูล PostgreSQL (เก็บไว้ใน backups/)
	@mkdir -p backups
	@echo "⏳ กำลังสำรองข้อมูล Database..."
	@docker compose exec -t db pg_dump -U hotel_app -d hotel_booking > backups/hotel_booking_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ สำรองข้อมูลเรียบร้อยที่โฟลเดอร์ backups/"

db-restore: ## นำข้อมูล PostgreSQL กลับมา (ตัวอย่าง: make db-restore FILE=backups/xxx.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "❌ กรุณาระบุไฟล์ backup: make db-restore FILE=backups/xxx.sql"; \
		exit 1; \
	fi
	@echo "⏳ กำลังนำข้อมูล Database กลับมาที่ hotel_booking..."
	@cat $(FILE) | docker compose exec -T db psql -U hotel_app -d hotel_booking
	@echo "✅ นำข้อมูลกลับมาเรียบร้อย"

# --- Migrations ---

migrate-up: ## รัน Database Migration (อัปเดต Schema ล่าสุด)
	@if [ -z "$(DATABASE_URL)" ]; then echo "❌ DATABASE_URL is not set"; exit 1; fi
	migrate -path apps/api/migrations -database "$(DATABASE_URL)" up

migrate-down: ## ย้อนกลับ Database Migration ทั้งหมด
	@if [ -z "$(DATABASE_URL)" ]; then echo "❌ DATABASE_URL is not set"; exit 1; fi
	migrate -path apps/api/migrations -database "$(DATABASE_URL)" down -all

# --- Go Code Quality ---

test: ## รัน Unit Tests ใน apps/api
	cd apps/api && go test -v ./...

vet: ## รัน Go Vet เพื่อตรวจสอบปัญหาในโค้ด
	cd apps/api && go vet ./...

format: ## รัน Go fmt เพื่อจัดรูปแบบโค้ด
	cd apps/api && go fmt ./...

tidy: ## รัน go mod tidy จัดการ dependencies
	cd apps/api && go mod tidy

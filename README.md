# 🏨 Aurora Grand Hotel

ระบบจัดการโรงแรมและการจองห้องพักครบวงจร 

ปัจจุบันโปรเจกต์อยู่ใน **Branch 01: Project Setup** ซึ่งประกอบด้วยโครงสร้างพื้นฐานสำหรับ Backend และ Database 

## 🏗️ โครงสร้างปัจจุบัน (Infrastructure)

- **Go API Server** (Chi Router) โครงสร้าง Clean Architecture
- **PostgreSQL 17** ผ่าน Docker Compose
- **Health/Readiness Probes** สำหรับตรวจสอบการทำงาน
- การกำหนดค่าผ่านไฟล์ `.env`

## 📋 ข้อกำหนดเบื้องต้น (Prerequisites)

- Docker และ Docker Compose
- Go 1.26
- Make (สำหรับใช้งาน `Makefile`)
- [golang-migrate](https://github.com/golang-migrate/migrate) (สำหรับ Database Migrations)
  - macOS: `brew install golang-migrate`
  - อื่นๆ: ดูวิธีติดตั้งในเว็บไซต์ของ golang-migrate

## 🚀 การติดตั้งและรันระบบ (Setup & Run)

การพัฒนาจะแยก Database (รันใน Docker) และ API (รันบนเครื่อง Local) ออกจากกัน

### Step 1 — Start PostgreSQL
### Step 1 — Start PostgreSQL and Database setup

1. **คัดลอกไฟล์ `.env`**
   ```bash
   cp .env.example .env
   ```

2. **เริ่มการทำงาน Database**
   ```bash
   make db-setup
   ```

3. **ติดตั้ง Database Schema**
   ```bash
   make migrate-up
   ```

4. **สร้างข้อมูลจำลอง (Development Seed)**
   ```bash
   make seed
   ```
   *(หมายเหตุ: คำสั่งนี้ทำงานแบบ Idempotent สามารถรันซ้ำได้โดยไม่ทำให้ข้อมูลซ้ำซ้อน รันคำสั่งนี้เพื่อให้มีข้อมูลสมมติสำหรับการทดสอบบน development database คำสั่งจะเชื่อมต่อไปยัง PostgreSQL Docker service โดยตรง)*

### Step 2 — Start Go backend manually

เมื่อ Database พร้อมแล้ว ให้รัน Go backend:
```bash
make dev
```
*(หรือใช้ `cd backend && go run ./cmd/server`)*

### 🏗️ Architecture during development

```text
Host machine
│
├── Go Backend
│   └── localhost:8080
│
└── Docker
    └── PostgreSQL
        └── localhost:${POSTGRES_HOST_PORT}
```

## 🛠️ การใช้งาน Makefile Commands

- `make db-setup` — รัน PostgreSQL และสร้าง Test Database (`hotel_booking_test`) อัตโนมัติ
- `make db-up` — รันเฉพาะ PostgreSQL ในโหมด background
- `make db-down` — หยุด PostgreSQL
- `make dev` — รัน Go API บนเครื่อง local
- `make build` — คอมไพล์ Go API เพื่อตรวจสอบ
- `make db-backup` — สำรองข้อมูล Database เก็บใน `backups/`
- `make db-restore FILE=backups/xxx.sql` — คืนค่า Database จากไฟล์

### Database Migrations
- `make migrate-up` — รัน Migration สร้างโครงสร้างตารางล่าสุด
- `make migrate-down` — ย้อนกลับ Migration ทั้งหมด (ลบตาราง)
- `make seed` — ใส่ข้อมูลเริ่มต้นแบบ Idempotent สำหรับ Development (เชื่อมต่อตรงเข้า PostgreSQL Docker container)

## 🩺 การทำงานของ API และ Health Endpoints

API รันที่พอร์ต `8080` (หรือตามค่า `API_PORT` ใน `.env`)

1. **Liveness Probe**: (ตรวจสอบว่าแอปไม่ล่ม)
   ```bash
   curl -i http://localhost:8080/health/live
   ```
   *(สถานะ: 200 OK)*

2. **Readiness Probe**: (ตรวจสอบว่าพร้อมรับ Request + เชื่อม DB สำเร็จ)
   ```bash
   curl -i http://localhost:8080/health/ready
   ```
   *(สถานะ: 200 OK หรือ 503 ถ้า DB ไม่พร้อม)*

## 🐘 การเชื่อมต่อ Database ด้วยโปรแกรมภายนอก (เช่น pgAdmin, DBeaver)

- Host: `localhost` หรือ `127.0.0.1`
- Port: `5433` (ค่าเริ่มต้นของทีม) หรือ `5434` (ถ้าคุณ override ไว้ใน `.env`)
- Database: `hotel_booking`
- Username: `hotel_app`
- Password: *(ดูในไฟล์ .env)*

> **⚠️ หมายเหตุสำหรับ Docker Network**: ตัว Container ของ Database จะรันอยู่บนพอร์ตภายใน `5432` เสมอ แต่อย่าใช้พอร์ตนี้เชื่อมต่อจากภายนอก
> **⚠️ คำเตือน**: ไม่ควรใช้ User `postgres` ในแอปพลิเคชัน 

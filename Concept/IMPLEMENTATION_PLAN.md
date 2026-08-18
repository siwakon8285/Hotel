# 🏨 Aurora Grand Hotel — Branch Implementation Plan

แผนการทำงานแบ่งเป็น **13 branches** ตาม 8 Phases ของ concept
โดยแต่ละ branch มีขอบเขตชัดเจนและ merge กลับ `main` เมื่อเสร็จ

**Tech Decisions:**
- Go HTTP Framework: **Chi** (stdlib-compatible, ตรง Concept + ใกล้เคียง net/http ตาม BACKEND.md)
- Go Version: **1.26**
- DB Driver: **pgx/v5**
- Migration Tool: **golang-migrate**
- Architecture: **Clean Architecture 3 Layers** (Domain / Application / Infrastructure)
- Frontend: **Next.js 16** (App Router), **Node.js 24 LTS**
- UI Components: **Shadcn UI (Radix UI)** + **Lucide React**
- Validation (FE): **Zod**
- Error Format: `{ "error": { "code": "...", "message": "..." } }`
- Money Type: **PostgreSQL `NUMERIC(12,2)`** + **Go `int64` หน่วยสตางค์** (ห้าม float)
- Booking Idempotency: **`Idempotency-Key` header** สำหรับ POST /bookings
- Health Endpoints: **`/health/live`** + **`/health/ready`** (ตรวจ DB connection)
- Comment Language: **ภาษาไทย**

---

## 🔀 Git Workflow

```bash
# แต่ละ branch ทำงานแบบนี้:
git checkout main
git pull origin main
git checkout -b feature/01-project-setup

# ทำงาน... commit เป็น conventional commits
git commit -m "feat: add docker-compose with postgres"
git commit -m "feat: add Go server with health check"
git commit -m "chore: add Makefile with dev commands"

# เสร็จแล้ว push + merge
git push origin feature/01-project-setup
git checkout main
git merge feature/01-project-setup
git push origin main

# ต่อ branch ถัดไป
git checkout -b feature/02-database
```

---

## 📊 Branch Overview

| # | Branch | Phase | สิ่งที่ได้ | ขนาดงาน |
|---|--------|-------|-----------|---------|
| 1 | `feature/01-project-setup` | 1 | Docker + Go server + health check | 🟢 เล็ก |
| 2 | `feature/02-database` | 1 | Schema + migrations ทั้งหมด | 🟡 กลาง |
| 3 | `feature/03-seed-data` | 1 | ข้อมูลจำลอง 8 ชั้น ~50 ห้อง | 🟢 เล็ก |
| 4 | `feature/04-backend-api` | 1 | REST API — hotels, floors, rooms | 🔴 ใหญ่ |
| 5 | `feature/05-nextjs-shell` | 2 | Next.js 16 + design system + API layer | 🟡 กลาง |
| 6 | `feature/06-3d-hotel-scene` | 2 | 3D hotel + camera + lighting | 🔴 ใหญ่ |
| 7 | `feature/07-scroll-floor-selection` | 3 | GSAP scroll + floor selector | 🔴 ใหญ่ |
| 8 | `feature/08-room-selection` | 4 | Room data + 3D room interaction | 🟡 กลาง |
| 9 | `feature/09-room-interior` | 5 | Room interior + info panel | 🔴 ใหญ่ |
| 10 | `feature/10-booking-api` | 6 | Availability + booking + pricing API | 🔴 ใหญ่ |
| 11 | `feature/11-booking-ui` | 6 | Booking interface frontend | 🟡 กลาง |
| 12 | `feature/12-security-validation` | 7 | Security + tests | 🟡 กลาง |
| 13 | `feature/13-polish-docs` | 8 | Mobile + a11y + perf + docs | 🟡 กลาง |

---

## 🏛️ Backend Architecture — Clean Architecture 3 Layers

> อ้างอิงจาก BACKEND.md — Domain / Application / Infrastructure

```
┌─────────────────────────────────────┐
│         Infrastructure Layer        │  ← HTTP handlers, DB repos, External APIs
├─────────────────────────────────────┤
│         Application Layer           │  ← Use Cases, Business workflows
├─────────────────────────────────────┤
│           Domain Layer              │  ← Entities, Repository interfaces, Value Objects
└─────────────────────────────────────┘
       ↑ Dependency ไหลขึ้นเท่านั้น
       Domain ไม่รู้จัก Infrastructure เลย
```

**กฎ Dependency:**
- **Domain** ไม่ import ชั้นอื่นเลย — pure business logic
- **Application** import ได้เฉพาะ Domain
- **Infrastructure** import ได้ทั้ง Domain และ Application
- ห้าม import ย้อนกลับ

**Use Case Pattern:**
- 1 Use Case = 1 ไฟล์
- Use Case รับ input struct → validate → เรียก repository → return output struct
- Use Case ไม่รู้จัก HTTP status code
- Handler แปลง HTTP request → เรียก Use Case → แปลงผลลัพธ์เป็น HTTP response

```
backend/
├── cmd/
│   └── server/
│       └── main.go                    → App entry, router assembly
├── internal/
│   ├── config/
│   │   └── config.go                  → Struct-based config (ห้าม os.Getenv ลอยๆ)
│   ├── domain/
│   │   ├── entities/                  → Hotel, Floor, Room, RoomType, Amenity, Booking
│   │   ├── repositories/             → Repository interfaces (traits)
│   │   └── value_objects/            → Status enums, BookingReference, etc.
│   ├── application/
│   │   ├── use_cases/                → 1 Use Case = 1 ไฟล์
│   │   └── dtos/                     → Input/Output structs
│   └── infrastructure/
│       ├── http/
│       │   ├── handlers/             → Thin handlers (HTTP ↔ Use Case only)
│       │   ├── middleware/           → CORS, logging, recovery, rate limit
│       │   └── router.go            → Chi route definitions
│       └── database/
│           └── repositories/         → pgx/v5 repository implementations
├── migrations/                       → golang-migrate SQL files
└── go.mod
```

---

## Phase 1 — Infrastructure & Backend Foundation

---

### Branch 1: `feature/01-project-setup`

**เป้าหมาย**: วาง monorepo structure, Docker, environment config

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Monorepo structure | `frontend/`, `backend/` (Clean Architecture), `docker/`, `docs/` |
| Go module init | Go 1.26, `go mod init` สำหรับ `backend/` |
| Backend config | `internal/config/config.go` — **Struct-based config**, ห้าม `os.Getenv()` ลอยๆ, validate required env vars |
| Basic server | `cmd/server/main.go` — **Chi** HTTP router |
| **Health endpoints** | `/health/live` — liveness probe (API ยังทำงาน, ไม่ต้องเช็ค dependency) |
| | `/health/ready` — readiness probe (**ตรวจ PostgreSQL connection** ด้วย `db.Ping()`) |
| | แยก 2 endpoint เพื่อรองรับ Docker/K8s health check ที่แม่นยำ |
| **Docker Compose** | |
| | PostgreSQL: **`${POSTGRES_HOST_PORT:-5433}:5432`** (ห้ามใช้ 5432 เพราะ local PG ใช้อยู่) |
| | Named volume: `postgres_data` |
| | **Healthcheck**: `pg_isready` + `interval: 5s, retries: 10, start_period: 10s` |
| | `depends_on: condition: service_healthy` |
| | App ใน container ใช้ hostname `db` ไม่ใช่ `localhost` |
| **App user แยก** | ห้ามใช้ superuser `postgres` — สร้าง app user: `POSTGRES_USER=hotel_app` |
| **Database timezone** | ตั้ง timezone เป็น **UTC** |
| Environment files | `.env.example` (ค่าตัวอย่าง), `.env` (gitignored) |
| | รวม `POSTGRES_HOST_PORT`, `TEST_DATABASE_URL` |
| Makefile | `make dev`, `make build`, `make db-up`, `make db-down` |
| | `make db-backup`, `make db-restore` |
| `.gitignore` | Go binaries, node_modules, .env, .next, *.sql backup dumps |
| Comment ภาษาไทย | ทุกบรรทัดอธิบายเป็นภาษาไทย |

**Merge criteria**: `docker compose up` เริ่ม postgres (healthcheck ผ่าน) + Go API ตอบ `/health/live` (200) + `/health/ready` (200 เมื่อ DB connected, 503 เมื่อไม่ได้)

---

### Branch 2: `feature/02-database`

**เป้าหมาย**: สร้าง database schema ทั้งหมด + migration system

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Migration tool | **golang-migrate**, naming: `YYYYMMDDHHMMSS_description.up.sql` / `.down.sql` |
| **Naming convention** | `snake_case`, ชื่อตาราง**พหูพจน์**, PK: `id`, FK: `<table_singular>_id` |
| | ทุกตารางมี `created_at`, `updated_at` (timestamp, UTC) |
| Migration: hotels | `id` (UUID), `name`, `slug`, `description`, `address`, `city`, `country`, `latitude`, `longitude`, timestamps |
| Migration: floors | `id`, `hotel_id` (FK), `floor_number`, `name`, `description`, timestamps |
| Migration: room_types | `id`, `hotel_id` (FK), `name`, `description`, **`base_price NUMERIC(12,2)`**, `max_guests`, `bed_type`, `room_size`, timestamps |
| | ⚠️ **ห้ามใช้ `float`/`real`/`double precision` สำหรับราคา** — ใช้ `NUMERIC(12,2)` เท่านั้น |
| Migration: rooms | `id`, `floor_id` (FK), `room_type_id` (FK), `room_number`, `status`, `model_key`, timestamps |
| Migration: amenities | `id`, `name`, `icon` |
| Migration: room_amenities | `room_id` (FK), `amenity_id` (FK) — many-to-many |
| Migration: bookings | `id`, `booking_reference`, `room_id` (FK), guest info, dates, `status`, timestamps |
| | pricing fields: **`nightly_price NUMERIC(12,2)`**, **`subtotal NUMERIC(12,2)`**, **`tax_amount NUMERIC(12,2)`**, **`total_amount NUMERIC(12,2)`** |
| | `idempotency_key` (VARCHAR, UNIQUE) — ป้องกัน duplicate booking จาก retry |
| Idempotency index | `idx_bookings_idempotency_key` (UNIQUE) |
| Indexes | `idx_rooms_floor_id`, `idx_rooms_room_type_id`, `idx_bookings_room_id`, `idx_bookings_check_in`, `idx_bookings_check_out`, `idx_bookings_reference`, `idx_bookings_guest_email` |
| Exclusion constraint | ป้องกัน overlapping bookings ที่ระดับ DB |
| **Encoding** | UTF8 (default PostgreSQL) — ตรวจสอบด้วย `SHOW server_encoding;` |
| **Test database** | สร้าง `hotel_booking_test` แยก + `TEST_DATABASE_URL` ใน `.env.example` |
| Migration ต้อง **reproducible** | ทำงานกับ database ว่างได้ |
| Makefile update | `make migrate-up`, `make migrate-down` |

**Merge criteria**: `make migrate-up` สร้างตารางทั้งหมดได้, `make migrate-down` rollback ได้, migration ทำงานกับ DB ว่าง

---

### Branch 3: `feature/03-seed-data`

**เป้าหมาย**: สร้างข้อมูลจำลอง Aurora Grand Hotel

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Hotel | "AURORA GRAND HOTEL" — 1 โรงแรม |
| Floors | 8 ชั้น (Floor 1-8) |
| Room Types | Deluxe King, Premier Twin, Ocean View Suite, Executive Suite, Presidential Suite |
| Rooms | ~50 ห้อง กระจายตามชั้น (ชั้นสูง → ห้อง premium มากขึ้น) |
| Amenities | Wi-Fi, Air Conditioning, Smart TV, Bathtub, Breakfast, Balcony, Ocean View, Room Service |
| Room-Amenity mapping | แต่ละ room type มี amenities ที่สมจริง |
| Seed ต้อง **idempotent** | รันซ้ำได้ไม่ error, ไม่มีข้อมูลจริงหรือ secret |
| Seed command | `make seed` |

**Merge criteria**: `make seed` insert ข้อมูลครบ, query ห้องตามชั้นได้ถูกต้อง

---

### Branch 4: `feature/04-backend-api`

**เป้าหมาย**: REST API สำหรับ hotels, floors, rooms (อ่านข้อมูล) — Clean Architecture

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| **Domain Layer** | |
| | `entities/` — Go structs: Hotel, Floor, Room, RoomType, Amenity |
| | `repositories/` — Repository **interfaces** (ไม่มี implementation) |
| | `value_objects/` — RoomStatus enum, etc. |
| **Application Layer** | |
| | `use_cases/` — **1 Use Case = 1 ไฟล์**: GetHotels, GetHotelByID, GetFloors, GetFloorByID, GetRooms, GetRoomByID, SearchRooms |
| | `dtos/` — Input/Output structs สำหรับแต่ละ Use Case |
| | Use Case ไม่รู้จัก HTTP status code |
| **Infrastructure Layer** | |
| | `http/handlers/` — **Thin handlers**: แปลง HTTP request → เรียก Use Case → return HTTP response |
| | `http/middleware/` — Request logging, recovery, CORS, request size limit |
| | `http/router.go` — Chi route definitions (ไม่มี logic) |
| | `database/repositories/` — **pgx/v5** repository implementations (parameterized queries) |
| **Error Handling** | ตรวจ error ทุกบรรทัด, ห้าม `_` discard error, ห้าม `panic` ใน production |
| **Error Format** | `{ "error": { "code": "ROOM_NOT_FOUND", "message": "..." } }` — ห้าม expose stack trace |
| **Structured Logging** | Log startup, DB connection, request errors — ห้าม log password/secret |
| **Context** | ส่ง `context.Context` เป็น param แรกทุก function ที่ทำ IO |

**API Endpoints:**

```
GET  /api/v1/hotels
GET  /api/v1/hotels/:hotelId
GET  /api/v1/hotels/:hotelId/floors
GET  /api/v1/floors/:floorId
GET  /api/v1/floors/:floorId/rooms
GET  /api/v1/rooms/:roomId
GET  /api/v1/rooms/search?check_in=&check_out=&guests=&room_type=
```

**Merge criteria**: API ทุก endpoint ตอบ JSON ถูกต้อง, ดึงข้อมูลจาก PostgreSQL ผ่าน Clean Architecture ครบ 3 layers

---

## Phase 2 — Frontend Foundation

---

### Branch 5: `feature/05-nextjs-shell`

**เป้าหมาย**: ตั้ง Next.js 16 project + design system + API layer + types

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| **Next.js 16** | App Router, TypeScript Strict, **Node.js 24 LTS** |
| **Tailwind CSS** | Design tokens — luxury colors (warm neutrals, black, gold accents) |
| **Shadcn UI (Radix UI)** | Atomic components ใน `/components/ui/` |
| **Lucide React** | Icon library |
| Google Fonts | Playfair Display (headings) + Inter (body) |
| **Zod** | Frontend validation |
| TypeScript interfaces | `Hotel`, `Floor`, `Room`, `RoomType`, `Amenity`, `Booking`, `Availability` — ใน `/types/` |
| API service layer | `hotel.service.ts`, `floor.service.ts`, `room.service.ts`, `booking.service.ts` — ใน `/services/` |
| Environment | `NEXT_PUBLIC_API_URL` — ห้าม secret ใน NEXT_PUBLIC |
| Layout | Root layout, **Server Components by default**, `'use client'` เฉพาะเมื่อจำเป็น |
| Navigation | Minimal: Hotel, Rooms, Experience, Booking, Contact |
| Loading screen | Premium: "AURORA GRAND — Loading your experience" + progress |
| State management | Zustand store: `HOTEL_VIEW`, `FLOOR_VIEW`, `ROOM_VIEW`, `ROOM_INTERIOR`, `BOOKING` |
| **Security headers** | ตั้งใน `next.config`: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| Docker config | Dockerfile สำหรับ web service |
| **Folder structure** | |
| | `/app` — routes and layouts |
| | `/components/ui` — Shadcn atomic components |
| | `/components/shared` — reusable business components |
| | `/hooks` — custom React hooks |
| | `/lib` — server-side utilities |
| | `/types` — shared TypeScript definitions |
| | `/services` — API service layer |

**Merge criteria**: `npm run dev` แสดงหน้าเว็บ + ดึงข้อมูลจาก API ได้ + loading screen ทำงาน + security headers ตั้งค่าถูกต้อง

---

## Phase 2 (ต่อ) — 3D Experience

---

### Branch 6: `feature/06-3d-hotel-scene`

**เป้าหมาย**: สร้าง 3D hotel scene พื้นฐาน + camera + lighting

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Dependencies | Three.js, React Three Fiber, Drei, Lenis |
| `HotelCanvas` | Full-screen R3F Canvas wrapper |
| `HotelScene` | Scene container |
| `HotelBuilding` | Procedural geometry — อาคาร 8 ชั้น (boxes) |
| `HotelFloor` | แต่ละชั้นเป็น component แยก, interactive |
| `Lighting` | Ambient + Directional + soft shadows |
| `Environment` | Sky/environment background |
| `CameraController` | เริ่มที่ตำแหน่ง exterior, mouse-based parallax เล็กน้อย |
| `HeroSection` | Hotel name + description + CTA overlays |
| Performance | Responsive DPR, Suspense wrapper |

**Merge criteria**: เปิดหน้าเว็บเห็นอาคาร 3D + lighting สวยงาม + hero text overlay + mouse parallax

---

## Phase 3 — Scroll & Floor Selection

---

### Branch 7: `feature/07-scroll-floor-selection`

**เป้าหมาย**: GSAP scroll-driven camera + floor selection UI

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Lenis integration | Smooth scrolling + GSAP ScrollTrigger sync |
| Scroll camera | Scroll → camera เข้าใกล้อาคาร → ซูมเข้าชั้นต่างๆ (scrub-based) |
| Hero fade | Scroll → hero text fade out |
| Floor hover | Hover ชั้น → highlight, แยกเล็กน้อย, แสดงเลขชั้น |
| `FloorSelector` UI | Floating UI เลือกชั้น 01-08 |
| Floor camera | เลือกชั้น → camera smooth transition ไปชั้นนั้น |
| `prefers-reduced-motion` | ลด animation สำหรับ reduced motion |

**Merge criteria**: Scroll เข้าใกล้ตึก → เห็นชั้นชัด → hover highlight → คลิกชั้น → camera เลื่อนไปชั้นนั้น

---

## Phase 4 — Room Selection + API Integration

---

### Branch 8: `feature/08-room-selection`

**เป้าหมาย**: เชื่อม floor/room data จาก backend + room selection 3D

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Fetch floor data | เลือกชั้น → ดึงห้องจาก API `/floors/:floorId/rooms` |
| `HotelRoom` component | แต่ละห้องใน 3D scene มี `roomId` จาก backend |
| Room states | Available / Limited / Reserved / Unavailable — สี/style ต่างกัน |
| Room hover | Hover → outline/glow + floating info card (ชื่อห้อง, ประเภท, ราคา) |
| `RoomSelector` UI | UI list ห้องบนชั้นนั้น (Shadcn UI components) |
| Room search | `/api/v1/rooms/search` — ค้นหาตาม check_in, check_out, guests, room_type |

**Merge criteria**: เลือกชั้น → เห็นห้องจาก DB → hover ดู info → คลิกเลือกห้อง

---

## Phase 5 — Room Interior

---

### Branch 9: `feature/09-room-interior`

**เป้าหมาย**: Camera transition เข้าห้อง + room interior + info panel

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Camera transition | เลือกห้อง → cinematic camera: exterior → floor → room entrance → interior |
| `RoomInterior` | Placeholder geometry: เตียง, โต๊ะ, TV, หน้าต่าง, ระเบียง |
| Model mapping | `model_key` → 3D asset path (เตรียมไว้สำหรับ GLB ในอนาคต) |
| `RoomInfoPanel` | Overlay: ชื่อห้อง, เลขห้อง, ราคา/คืน, จำนวนผู้เข้าพัก, ขนาด, amenities |
| Navigation buttons | Book This Room, Next/Previous Room, Back to Floor, Back to Hotel |
| Amenities display | แสดง amenities จาก backend พร้อม **Lucide React** icons |

**Merge criteria**: คลิกห้อง → camera เลื่อนเข้า room → เห็น interior + info panel + amenities → กดย้อนกลับได้

---

## Phase 6 — Booking System

---

### Branch 10: `feature/10-booking-api`

**เป้าหมาย**: Backend API สำหรับ availability + booking + pricing — Clean Architecture

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| **Domain Layer** | |
| | `entities/booking.go` — Booking entity |
| | `repositories/booking_repository.go` — interface |
| | `value_objects/booking_status.go` — pending/confirmed/cancelled/completed |
| | `value_objects/booking_reference.go` — HTL-YYYYMMDD-XXXXX |
| **Application Layer** | |
| | `use_cases/check_availability.go` — ตรวจ overlapping bookings |
| | `use_cases/calculate_pricing.go` — nightly_price × nights + tax |
| | `use_cases/create_booking.go` — PostgreSQL transaction + row locking, concurrency-safe |
| | `use_cases/get_booking.go` — ดึง booking by ID |
| | `use_cases/cancel_booking.go` — เปลี่ยน status |
| | `dtos/` — BookingInput, BookingOutput, PricingOutput |
| **Infrastructure Layer** | |
| | `http/handlers/booking_handler.go` — thin handler |
| | `http/middleware/idempotency.go` — ตรวจ `Idempotency-Key` header |
| | `database/repositories/booking_repo_pgx.go` — pgx/v5, parameterized queries, transaction |
| **💰 Money Type** | Go ใช้ **`int64` หน่วยสตางค์** (7900 บาท = `790000`) — ห้ามใช้ `float64` |
| | แปลงเป็น `NUMERIC(12,2)` ตอนเขียน DB, แปลงกลับตอนอ่าน |
| | ราคาที่ส่งให้ frontend เป็น **บาท** (string หรือ number 2 decimal places) |
| **🔑 Idempotency-Key** | POST `/api/v1/bookings` ต้องส่ง header `Idempotency-Key` |
| | ถ้า key ซ้ำ → return booking เดิม (ไม่สร้างใหม่) |
| | เก็บ `idempotency_key` ใน bookings table (UNIQUE constraint) |
| | ป้องกัน: กดปุ่ม Confirm ซ้ำ, network retry, duplicate request |
| **Validation** | check_out > check_in, guests ≤ max_guests, room available, valid email |
| **Error handling** | ตรวจ error ทุกบรรทัด, ห้าม `_` discard |

**API Endpoints:**

```
GET  /api/v1/rooms/:roomId/availability?check_in=...&check_out=...
POST /api/v1/bookings
GET  /api/v1/bookings/:bookingId
POST /api/v1/bookings/:bookingId/cancel
```

**Merge criteria**: create/query/cancel booking ผ่าน API ได้ + double booking ถูกป้องกัน + idempotency-key ทำงาน (ส่งซ้ำได้ booking เดิม) + pricing ไม่มี floating point error

---

### Branch 11: `feature/11-booking-ui`

**เป้าหมาย**: Booking interface บน frontend

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| `AvailabilityForm` | เลือก check-in, check-out, จำนวนผู้เข้าพัก, room type — **Zod** validation |
| Date picker | Shadcn UI date picker component |
| Availability check | ส่ง request ไป backend → แสดงสถานะ available/unavailable |
| `BookingPanel` | Shadcn UI Drawer/Modal: ห้อง, วันที่, จำนวนคืน, ราคา, ภาษี, total |
| Pricing display | ราคาทั้งหมดมาจาก backend (ไม่คำนวณเองที่ frontend) |
| Confirm booking | ส่ง `POST /api/v1/bookings` พร้อม **`Idempotency-Key` header** (UUID generated ต่อ 1 booking attempt) → แสดง booking reference |
| | ป้องกัน double-click: disable ปุ่มหลังกด + idempotency-key กัน backend |
| Confirmation page | หน้ายืนยัน: booking reference + รายละเอียดทั้งหมด |
| Error handling | แสดง error สวยงามเมื่อห้องไม่ว่าง, วันที่ผิด, etc. |
| ไม่มี business logic ใน component | เรียก backend API เท่านั้น |

**Merge criteria**: User flow ครบ: เลือกห้อง → เลือกวัน → เช็คราคา → จอง → ได้ booking reference

---

## Phase 7 — Security & Validation

---

### Branch 12: `feature/12-security-validation`

**เป้าหมาย**: ความปลอดภัย, validation เข้มงวด, testing

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| Input validation | ทุก endpoint validate ครบ |
| Parameterized queries | ตรวจสอบว่าไม่มี SQL string concatenation |
| Secure headers | HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| Rate limiting | Booking endpoint rate limit |
| Request size limits | จำกัดขนาด request body |
| Error handling | ทุก error path มี explicit handler — ไม่มี silent fail |

**Go Tests (testify):**

| Test | Coverage |
|------|----------|
| ✅ Room availability | overlap / non-overlap |
| ✅ Invalid dates | check_out ≤ check_in |
| ✅ Guest capacity | exceed max_guests |
| ✅ Price calculation | nightly × nights + tax |
| ✅ Booking creation | success case |
| ✅ Booking cancellation | status change |
| ✅ API validation | missing/invalid fields |
| ✅ Double-booking | concurrent booking test |

**Go checks:**
```bash
go test ./...
go vet ./...
staticcheck ./...
```

**Frontend Tests:**
| Tool | Scope |
|------|-------|
| **Jest + React Testing Library** | Unit/component tests |
| **Playwright** | E2E: booking flow, room selection |

```bash
npm test
npm audit --audit-level=high
```

**Test database**: ใช้ `TEST_DATABASE_URL` ชี้ไป `hotel_booking_test` — ห้ามใช้ dev/production DB

**Merge criteria**: `go test ./... && go vet ./...` ผ่าน + `npm test` ผ่าน + security middleware ทำงาน

---

## Phase 8 — Polish & Production Readiness

---

### Branch 13: `feature/13-polish-docs`

**เป้าหมาย**: Mobile, accessibility, performance, documentation

| สิ่งที่ทำ | รายละเอียด |
|-----------|------------|
| **Mobile** | Lower DPR, simplified lighting/transitions, touch-friendly UI |
| **Accessibility** | `prefers-reduced-motion`, semantic HTML, keyboard navigation |
| **Performance** | Lazy loading, dynamic imports, Suspense, Draco support, mesh instancing |
| **README** | Project overview, architecture, tech stack, setup, Docker, migrations, seed, API, 3D model guide |
| | วิธีเชื่อม pgAdmin (host: localhost, port: 5433) |
| | อธิบายให้ dev ใหม่ clone + `cp .env.example .env && docker compose up --build` ได้ |

**Final Verification Checklist:**

```
✅ npm run lint
✅ npx tsc --noEmit
✅ npm run build
✅ npm test
✅ npm audit --audit-level=high
✅ go test ./...
✅ go vet ./...
✅ staticcheck ./...
✅ docker compose up — ทั้งระบบทำงาน + healthcheck ผ่าน
✅ Frontend ↔ Backend สื่อสารได้
✅ Rooms ดึงจาก PostgreSQL
✅ Availability check ทำงาน
✅ Booking ทำงาน
✅ Double-booking ถูกป้องกัน
✅ Security headers ครบ
✅ .env ไม่ถูก track ใน Git
✅ App ไม่ใช้ superuser postgres
✅ Test DB แยกจาก dev DB
```

**Merge criteria**: ทุก verification checklist ผ่าน + README ครบ + mobile ใช้งานได้

---

## 📋 Branch Dependencies

```
01-project-setup
    └── 02-database
        └── 03-seed-data
            └── 04-backend-api
                ├── 05-nextjs-shell
                │   └── 06-3d-hotel-scene
                │       └── 07-scroll-floor-selection
                │           └── 08-room-selection
                │               └── 09-room-interior
                └── 10-booking-api
                    └── 11-booking-ui
                        └── 12-security-validation
                            └── 13-polish-docs
```

> **หมายเหตุ**: ลำดับ branch เป็น sequential — แต่ละ branch ต้อง merge ก่อนเริ่ม branch ถัดไป
> ยกเว้น branch 10 (booking-api) สามารถเริ่มได้คู่กับ branch 5-9 เพราะเป็นงาน backend แยก

---

## ✅ Checklist References

| ด้าน | อ้างอิง |
|------|---------|
| Backend code quality + OWASP 2025 | [BACKEND.md](file:///Users/siwakornbundi/Project/hotel/BACKEND.md) §Checklist ก่อน Complete Task |
| Database setup + Definition of Done | [DATABASE.md](file:///Users/siwakornbundi/Project/hotel/DATABASE.md) §Definition of Done |
| Frontend code quality | [FRONTEND.md](file:///Users/siwakornbundi/Project/hotel/FRONTEND.md) §Checklist ก่อน Complete Task |

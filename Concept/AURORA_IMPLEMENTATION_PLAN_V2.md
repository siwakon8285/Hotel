# 🏨 Aurora Grand Hotel — Branch Implementation Plan V2

> ปรับแผนจากแนวทาง 3D/WebGL เดิม เป็น **Luxury Hotel Website + Premium Motion**
> โดยยังคง Backend, Database, Booking Architecture และ Clean Architecture เดิมไว้

---

## 🎯 Product Direction

Aurora Grand Hotel จะเป็นเว็บไซต์โรงแรมหรูที่เน้น:

- Editorial luxury design
- Premium hospitality imagery
- Invisible-frame layout
- Smooth, restrained animation
- Scroll reveal / parallax / sticky storytelling
- Real room data from Go API + PostgreSQL
- Responsive + accessible
- Fast enough for production
- ไม่มี WebGL / Three.js / 3D hotel scene

### Visual Direction

- Warm ivory / soft beige / charcoal / deep brown / subtle gold
- Playfair Display สำหรับ heading
- Inter สำหรับ body/UI
- ภาพขนาดใหญ่ + generous whitespace
- ใช้ spacing, typography, tonal contrast แทนกรอบ card ชัด ๆ
- Animation ต้องช่วยเล่าเนื้อหา ไม่แย่งความสนใจจากเนื้อหา

---

## 🧱 Tech Decisions

- Backend: Go 1.26 + Chi
- DB: PostgreSQL + pgx/v5
- Migration: golang-migrate
- Backend Architecture: Clean Architecture 3 Layers
- Frontend: Next.js 16 + App Router
- Node.js: 24 LTS
- Styling: Tailwind CSS v4
- UI: Shadcn UI + Lucide React
- Validation: Zod
- State: Zustand
- Motion: GSAP + @gsap/react + ScrollTrigger
- Smooth Scroll: ยังไม่ใช้ Lenis โดย default
- Images: local assets ใน `frontend/public/images/`
- Money: PostgreSQL `NUMERIC(12,2)` + Go `int64` หน่วยสตางค์
- Error format: `{ "error": { "code": "...", "message": "..." } }`
- Booking idempotency: `Idempotency-Key`
- Comments: ภาษาไทยตามมาตรฐานโปรเจกต์

---

# 🔀 Branch Overview

| # | Branch | Phase | สิ่งที่ได้ | ขนาดงาน |
|---|---|---|---|---|
| 1 | `feature/01-project-setup` | 1 | Project structure + DB Docker + Go health | 🟢 |
| 2 | `feature/02-database` | 1 | Schema + migrations | 🟡 |
| 3 | `feature/03-seed-data` | 1 | Aurora seed data | 🟢 |
| 4 | `feature/04-backend-api` | 1 | Read-only Hotel/Floor/Room API | 🔴 |
| 5 | `feature/05-nextjs-shell` | 2 | Next.js shell + design system + API layer | 🟡 |
| 6 | `feature/06-luxury-landing-redesign` | 2 | Luxury homepage + imagery + invisible-frame UI | 🔴 |
| 7 | `feature/07-premium-scroll-motion` | 3 | GSAP scroll storytelling + parallax + sticky sections | 🔴 |
| 8 | `feature/08-rooms-showcase` | 4 | Real room browsing/search + premium room cards | 🔴 |
| 9 | `feature/09-room-detail-experience` | 5 | Room detail page + gallery + amenities + booking CTA | 🔴 |
| 10 | `feature/10-booking-api` | 6 | Availability + pricing + booking backend | 🔴 |
| 11 | `feature/11-booking-ui` | 6 | Booking frontend | 🟡 |
| 12 | `feature/12-security-validation` | 7 | Security + testing | 🟡 |
| 13 | `feature/13-polish-docs` | 8 | Mobile + a11y + perf + docs | 🟡 |

---

# ✅ Branches 01–05

Branches 01–05 ถือว่าเสร็จแล้วและคง architecture เดิม:

- Project / Docker / Go foundation
- PostgreSQL migrations
- Seed data
- Read-only backend API
- Next.js frontend foundation

Current repository structure:

```text
.
├── frontend/
├── backend/
├── database/
│   ├── migrations/
│   └── seeds/
├── docker/
├── docs/
├── Concept/
├── docker-compose.yml
├── Makefile
└── README.md
```

Development runtime:

```text
Frontend    http://localhost:3000
Backend     http://localhost:8080
PostgreSQL  localhost:5434 -> 5432 (Docker)
```

Docker Compose รัน PostgreSQL เท่านั้น

---

# Phase 2 — Luxury Frontend Foundation

## Branch 6: `feature/06-luxury-landing-redesign`

### เป้าหมาย

เปลี่ยน homepage จาก 3D/WebGL เป็น **Luxury Hotel Landing Page** แบบ editorial และ image-driven

### งานหลัก

#### 1. Remove 3D

ลบ:

- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- `@types/three`
- 3D Canvas
- CameraRig
- HotelBuilding / HotelFloor
- SceneLighting
- WebGL tests

ห้ามเหลือ stale import หรือ dead dependency

#### 2. Luxury Hero

สร้าง hero ขนาดใหญ่:

- ภาพโรงแรม / resort
- gradient overlay
- hotel name จาก backend
- tagline
- CTA: `Explore Rooms`
- CTA: `Book Your Stay`
- text composition แบบ editorial
- ไม่ใช้ card ใหญ่ทับกลางภาพ

#### 3. Invisible-frame Design

หลีกเลี่ยง:

- border หนา
- card box ทุก section
- dashboard layout
- rounded rectangle เยอะเกินไป

ใช้:

- whitespace
- typography
- large images
- tonal backgrounds
- soft shadows
- very subtle blur
- section rhythm

#### 4. Hotel Intro

แสดง:

- hotel description
- 8 floors
- 50 rooms
- 5 room types

ตัวเลขต้องมาจากข้อมูลจริงหรือค่าที่รองรับโดย seed/API

#### 5. Featured Rooms

แสดง room types / rooms จาก backend:

- room name
- price
- max guests
- amenities preview
- image
- CTA

ห้าม hardcode business data

#### 6. Amenities

สร้าง section แบบ open-layout:

- Wi-Fi
- Air Conditioning
- Smart TV
- Bathtub
- Breakfast
- Balcony
- Ocean View
- Room Service

ใช้ Lucide icons

#### 7. Signature Experience

สร้าง editorial storytelling:

- large image
- short copy
- hospitality positioning
- optional sticky-ready layout

Branch นี้ animation ยังเน้นเบา ๆ

#### 8. Gallery

สร้าง asymmetrical editorial gallery

#### 9. Booking CTA

สร้าง CTA section ขนาดใหญ่:

> Your stay begins here.

#### 10. Footer

Minimal luxury footer

### Assets

ใช้ local development assets:

```text
frontend/public/images/
├── hotel-hero.jpg
├── hotel-lobby.jpg
├── room-deluxe.jpg
├── room-premier.jpg
├── room-ocean-suite.jpg
├── room-executive.jpg
├── room-presidential.jpg
└── gallery-*.jpg
```

Temporary assets ต้องระบุว่าเป็น placeholder และไม่ควรโหลด runtime จาก Unsplash URL

### Motion

Branch 06 ทำเฉพาะ:

- CSS hover
- subtle fade
- initial hero entrance

GSAP สามารถติดตั้งเตรียมไว้ได้ แต่ scroll choreography หลักอยู่ Branch 07

### Merge Criteria

- 3D/WebGL ถูกถอดออกหมด
- homepage luxury redesign ทำงาน
- backend data ยังโหลดจริง
- responsive desktop/tablet/mobile
- invisible-frame styling ชัดเจน
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- ไม่มี fatal console error

---

# Phase 3 — Premium Scroll Motion

## Branch 7: `feature/07-premium-scroll-motion`

### เป้าหมาย

เพิ่ม premium motion ให้ homepage โดยไม่ทำให้เว็บดู flashy เกินไป

### Dependencies

- `gsap`
- `@gsap/react`
- `ScrollTrigger`

ไม่ใช้ Lenis โดย default

### Motion System

สร้าง reusable motion layer:

```text
frontend/src/
├── hooks/
│   ├── useReducedMotion.ts
│   └── useGsapReveal.ts
├── components/motion/
│   ├── Reveal.tsx
│   ├── ImageReveal.tsx
│   └── ParallaxImage.tsx
```

### Hero Motion

- slow image scale
- headline fade-up
- subtitle stagger
- CTA reveal
- navbar transition

### Section Reveal

- fade + translate
- stagger เฉพาะ group ที่เหมาะสม
- ไม่ animate ทุก element

### Image Reveal

ใช้ mask / clip-path / overflow reveal แบบ premium

### Parallax

ใช้เฉพาะ:

- hero image
- signature experience
- selected gallery images

### Sticky Storytelling

สร้าง 1 section พิเศษ:

- image sticky
- text/content เปลี่ยนตาม scroll
- ไม่ทำทั้งหน้าเป็น pinned experience

### Navbar

เมื่อ scroll:

- transparent → tonal/blur background
- height ลดเล็กน้อย
- contrast ยังดี

### Reduced Motion

`prefers-reduced-motion`:

- ปิด parallax
- ลด translate
- content ต้องมองเห็นทันที

### Cleanup

ทุก GSAP timeline / ScrollTrigger ต้อง cleanup ผ่าน `gsap.context()` / React integration

### Merge Criteria

- scroll ลื่น
- ไม่มี memory leak / duplicate triggers
- reduced-motion ทำงาน
- mobile ไม่กระตุกหนัก
- no horizontal overflow
- animations ไม่รบกวน CTA/booking
- lint/typecheck/test/build ผ่าน

---

# Phase 4 — Rooms Discovery

## Branch 8: `feature/08-rooms-showcase`

### เป้าหมาย

สร้าง room discovery experience แบบ 2D premium โดยใช้ข้อมูลจริงจาก backend

### Room Search

ใช้:

```text
GET /api/v1/rooms/search
```

รองรับ:

- check_in
- check_out
- guests
- room_type

### Featured Room Types

แสดง:

- Deluxe King
- Premier Twin
- Ocean View Suite
- Executive Suite
- Presidential Suite

ข้อมูล business จริงจาก API

### Room Cards

Invisible-frame style:

- large image
- room type
- price
- guests
- bed type
- room size
- amenities
- CTA

### Filters

สร้าง filter bar:

- dates
- guests
- room type

ใช้ Zod validate query input

### Room States

แสดง:

- available
- maintenance/disabled ไม่ให้จอง
- search availability result

ไม่สร้าง state ปลอมที่ backend ไม่มี

### Room Showcase Motion

- stagger entrance
- image hover zoom
- arrow/text micro-interaction
- optional horizontal editorial showcase

### Empty / Loading / Error

มี UI สำหรับ:

- loading
- no rooms
- API failure
- invalid search

### Merge Criteria

- rooms จาก PostgreSQL แสดงจริง
- search filters ทำงาน
- price exact
- mobile usable
- no hardcoded business data
- lint/typecheck/test/build ผ่าน

---

# Phase 5 — Room Detail Experience

## Branch 9: `feature/09-room-detail-experience`

### เป้าหมาย

สร้างหน้ารายละเอียดห้องระดับ premium โดยไม่ใช้ 3D

### Route

เช่น:

```text
/rooms/[roomId]
```

### Hero / Gallery

- large room image
- editorial gallery
- responsive image grid
- optional lightbox

### Room Information

แสดงข้อมูลจริง:

- room type
- room number
- price/night
- max guests
- bed type
- room size
- floor
- amenities

### Layout

Desktop:

```text
Gallery / content
      +
Sticky booking summary
```

Mobile:

```text
Single-column
Sticky/Bottom booking CTA
```

### Room Storytelling

สร้าง section:

- design story
- comfort
- view
- amenities
- room service

ใช้ motion จาก Branch 07

### Related Rooms

แสดงห้อง/ประเภทใกล้เคียง

### CTA

- Check Availability
- Book This Room
- Back to Rooms

ยังไม่สร้าง booking mutation เองจน Branch 10/11 พร้อม

### Merge Criteria

- room detail API ใช้งานจริง
- amenities/price correct
- URL routing ทำงาน
- loading/error/not-found มีครบ
- responsive
- premium gallery
- lint/typecheck/test/build ผ่าน

---

# Phase 6 — Booking System

## Branch 10: `feature/10-booking-api`

### เป้าหมาย

Backend API สำหรับ availability + pricing + booking

คง Clean Architecture เดิม

### Endpoints

```text
GET  /api/v1/rooms/:roomId/availability
POST /api/v1/bookings
GET  /api/v1/bookings/:bookingId
POST /api/v1/bookings/:bookingId/cancel
```

### Money

- Go: `int64` satang
- PostgreSQL: `NUMERIC(12,2)`
- ห้าม float

### Idempotency

`POST /bookings` ต้องใช้:

```text
Idempotency-Key
```

### Merge Criteria

- booking create/query/cancel
- double booking ถูกป้องกัน
- pricing exact
- idempotency ผ่าน
- tests ผ่าน

---

## Branch 11: `feature/11-booking-ui`

### เป้าหมาย

Frontend booking flow

### Features

- check-in/out
- guests
- room type
- availability check
- price breakdown จาก backend
- guest information
- confirm booking
- idempotency key
- booking confirmation

### UX

ใช้ luxury UI เดิม:

- invisible frames
- clear hierarchy
- minimal modal/drawer
- mobile-first booking controls

### Merge Criteria

ครบ flow:

```text
Discover Room
→ Check Availability
→ Review Price
→ Guest Details
→ Confirm
→ Booking Reference
```

---

# Phase 7 — Security & Validation

## Branch 12: `feature/12-security-validation`

### Backend

- strict validation
- parameterized SQL review
- rate limiting booking endpoint
- request body limits
- explicit error handling
- security logging

### Frontend

- security headers
- Zod validation
- safe error UI
- npm audit
- no leaked secrets

### Testing

Backend:

- availability
- date validation
- capacity
- price
- booking
- cancellation
- idempotency
- concurrent double booking

Frontend:

- API services
- room search
- room detail
- booking UI
- E2E booking flow

### Merge Criteria

security/test checklist ผ่าน

---

# Phase 8 — Production Polish

## Branch 13: `feature/13-polish-docs`

### Mobile

- responsive layout polish
- reduce animation complexity
- touch-friendly navigation
- sticky booking CTA

### Accessibility

- semantic HTML
- keyboard navigation
- reduced motion
- focus visibility
- contrast
- alt text

### Performance

เน้น:

- `next/image`
- AVIF/WebP
- image sizing
- lazy loading
- dynamic imports เฉพาะจำเป็น
- GSAP optimization
- Core Web Vitals
- no 3D/WebGL bundles

### SEO

เพิ่ม:

- metadata
- Open Graph
- hotel structured data where appropriate
- page titles/descriptions

### Documentation

README ต้องอธิบาย:

- architecture
- frontend/backend/database
- setup
- Docker PostgreSQL
- migrations
- seed
- API
- image asset strategy
- motion system
- booking flow

### Final Verification

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm audit --audit-level=high

go test ./...
go vet ./...
staticcheck ./...

docker compose config
```

Runtime:

```text
Frontend   :3000
Backend    :8080
Postgres   :5434
```

---

# 🔗 Branch Dependencies

```text
01-project-setup
    └── 02-database
        └── 03-seed-data
            └── 04-backend-api
                ├── 05-nextjs-shell
                │   └── 06-luxury-landing-redesign
                │       └── 07-premium-scroll-motion
                │           └── 08-rooms-showcase
                │               └── 09-room-detail-experience
                │
                └── 10-booking-api
                    └── 11-booking-ui

09-room-detail-experience + 11-booking-ui
    └── 12-security-validation
        └── 13-polish-docs
```

Branch 10 สามารถทำ parallel กับ frontend Branch 06–09 ได้เพราะเป็น backend work แยก

---

# 🧭 Updated Product Flow

```text
Luxury Hero
    ↓
Hotel Story
    ↓
Featured Rooms
    ↓
Amenities
    ↓
Signature Experience
    ↓
Gallery
    ↓
Rooms Search
    ↓
Room Detail
    ↓
Availability
    ↓
Booking
    ↓
Confirmation
```

---

# ✅ Definition of Done

Aurora Grand Hotel V2 ถือว่าพร้อม production เมื่อ:

- ไม่มี Three.js / R3F / WebGL dependency
- Luxury landing page สมบูรณ์
- premium scroll motion ทำงานและ reduced-motion รองรับ
- rooms/search ใช้ backend จริง
- room detail ใช้ backend จริง
- booking flow ครบ
- no float money calculations
- double-booking prevention ทำงาน
- mobile usable
- accessibility ผ่านพื้นฐาน
- security headers/validation ผ่าน
- frontend/backend tests ผ่าน
- production build ผ่าน
- image assets optimized
- README/documentation อัปเดตครบ

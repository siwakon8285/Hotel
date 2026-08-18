You are a senior full-stack software engineer and system architect.

Build a production-ready full-stack interactive hotel booking web application.

The core experience is a premium cinematic 3D hotel website where users can explore the hotel visually, select a floor, select a room, enter the room virtually, inspect room details, choose booking dates, and make a reservation.

Before writing code, inspect the entire existing repository and understand the current architecture, dependencies, configuration, coding conventions, and existing functionality.

Do not rewrite working parts unnecessarily.

Create a clear implementation plan first, then implement incrementally.

---

# 1. Product Concept

The website should not feel like a traditional hotel booking website.

It should feel like an immersive interactive architectural experience.

The main user journey is:

Hotel Exterior
→ Scroll toward the building
→ Explore floors
→ Select a floor
→ Explore rooms
→ Select a room
→ Camera moves into the selected room
→ Explore room interior
→ View room information
→ Select dates and guests
→ Book the room

The experience should feel:

* cinematic
* luxurious
* modern
* elegant
* smooth
* interactive
* premium

Avoid generic SaaS styling.

---

# 2. Technology Stack

Use a monorepo architecture.

Frontend:

* Next.js
* React
* TypeScript
* Tailwind CSS
* GSAP
* GSAP ScrollTrigger
* Three.js
* React Three Fiber
* Drei
* Lenis

Backend:

* Go
* REST API
* Gin or Chi
* PostgreSQL
* pgx
* sqlc or a clean repository layer
* JWT authentication if authentication is implemented

Database:

* PostgreSQL

Infrastructure:

* Docker
* Docker Compose
* environment variables
* database migrations
* development seed data

Use current stable package versions that are compatible with each other.

---

# 3. Repository Structure

Use a clean structure similar to:

```text
hotel-booking/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── public/
│   │
│   └── api/
│       ├── cmd/
│       │   └── server/
│       ├── internal/
│       │   ├── config/
│       │   ├── database/
│       │   ├── handler/
│       │   ├── middleware/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── service/
│       │   └── validation/
│       └── migrations/
│
├── docker/
│
├── docs/
│
├── docker-compose.yml
├── .env.example
├── README.md
└── Makefile
```

Keep business logic separated from HTTP handlers.

Do not put database queries directly inside route handlers.

---

# 4. Homepage 3D Experience

Create a full-screen cinematic landing page.

The initial scene should show a premium modern luxury hotel.

The hotel should fill most of the viewport.

Add subtle environmental effects:

* ambient lighting
* directional lighting
* soft shadows
* subtle reflections
* environmental background
* slight camera movement
* mouse-based parallax

Do not overuse effects.

The website should remain elegant and premium.

---

# 5. Hero Section

Show:

Hotel name

Short luxury description

CTA:

"Explore the Hotel"

Optional secondary CTA:

"View Rooms"

Use large typography and minimal UI.

As the user scrolls, animate the hero text away.

---

# 6. Scroll-Driven Hotel Camera

Use:

GSAP
GSAP ScrollTrigger

The camera should respond smoothly to scrolling.

Use scrub-based animation.

Example experience:

User scrolls down

→ Camera slowly approaches hotel

→ Hotel gets larger

→ Perspective changes

→ UI fades out

→ Individual hotel floors become visible

The animation must follow scroll position.

Do not use sudden cuts or teleportation.

---

# 7. Hotel Floor Selection

Create approximately 8 hotel floors.

Each floor should be independently interactive.

Example:

Floor 8
Floor 7
Floor 6
Floor 5
Floor 4
Floor 3
Floor 2
Floor 1

When hovering over a floor:

* highlight the floor
* brighten its lighting
* slightly separate it visually
* display its floor number

Create a floating floor selector UI.

Example:

```text
SELECT FLOOR

08
07
06
05
04
03
02
01
```

The selected floor should have a clear visual state.

When the user selects a floor:

smoothly move the Three.js camera toward that floor.

---

# 8. Floor Exploration

When entering a floor, reveal the available rooms.

Example:

```text
Floor 7

701
Deluxe King

702
Ocean View Suite

703
Executive Suite
```

Each room should be represented visually in the 3D scene.

Room states:

* Available
* Limited availability
* Reserved
* Unavailable

Rooms should react when hovered.

Possible effects:

* outline
* lighting
* slight movement
* floating room information card

---

# 9. Room Selection

When the user selects a room:

Camera:

Hotel exterior
→ floor
→ selected room
→ room entrance
→ room interior

The transition must be cinematic.

Use camera interpolation.

Do not instantly change camera position.

Use easing and smooth transitions.

---

# 10. Room Interior

Inside the room, show a premium hotel interior.

Eventually real GLTF/GLB models will be used.

Architect the 3D implementation so models can easily be replaced.

For the initial implementation, placeholder geometry is acceptable.

Example room features:

* king-size bed
* nightstands
* television
* seating area
* windows
* balcony
* bathroom
* decorative lighting

The user does not need FPS-style movement.

Keep navigation controlled and cinematic.

---

# 11. Room Information Overlay

When inside the room, display an elegant room details panel.

Example:

```text
Ocean View Suite

Room 702

฿7,900 / night

2 Guests

1 King Bed

48 m²

Panoramic ocean view with private balcony.
```

Amenities:

* Free Wi-Fi
* Smart TV
* Air conditioning
* Bathtub
* Breakfast
* Balcony
* Ocean view
* Room service

Buttons:

Book This Room

Next Room

Previous Room

Back to Floor

Back to Hotel

---

# 12. Search and Availability

Create a booking search interface.

Fields:

Check-in date

Check-out date

Number of guests

Room type

Optional:

Floor preference

When dates are selected, request real availability from the backend.

Do not determine availability only on the frontend.

The backend must be the source of truth.

---

# 13. Booking Flow

Booking flow:

Select room

→ choose dates

→ select guests

→ check availability

→ display pricing

→ review reservation

→ confirm reservation

Create an elegant booking drawer or modal.

Example:

```text
Reservation

Ocean View Suite
Room 702

Check-in
20 August 2026

Check-out
23 August 2026

3 Nights

Room
฿7,900 × 3

฿23,700

Taxes
฿1,659

Total
฿25,359

[ Confirm Booking ]
```

---

# 14. Backend Architecture

Build the backend using Go.

Use a clean layered architecture.

Layers:

HTTP Handler

→ Service

→ Repository

→ PostgreSQL

Responsibilities:

Handler:

* parse request
* validate basic request
* return HTTP response

Service:

* business logic
* booking rules
* availability logic
* price calculation

Repository:

* database access
* SQL queries

Do not mix these responsibilities.

---

# 15. Backend API

Create REST APIs.

Example routes:

## Hotels

GET /api/v1/hotels

GET /api/v1/hotels/:hotelId

---

## Floors

GET /api/v1/hotels/:hotelId/floors

GET /api/v1/floors/:floorId

---

## Rooms

GET /api/v1/floors/:floorId/rooms

GET /api/v1/rooms/:roomId

GET /api/v1/rooms/:roomId/availability

---

## Search

GET /api/v1/rooms/search

Parameters:

check_in

check_out

guests

room_type

---

## Bookings

POST /api/v1/bookings

GET /api/v1/bookings/:bookingId

POST /api/v1/bookings/:bookingId/cancel

---

# 16. PostgreSQL Database

Use PostgreSQL.

Create proper database migrations.

Core tables:

hotels

floors

room_types

rooms

amenities

room_amenities

guests

bookings

booking_guests

---

# 17. Hotel Table

Example:

```sql
hotels

id
name
slug
description
address
city
country
latitude
longitude
created_at
updated_at
```

---

# 18. Floors Table

```sql
floors

id
hotel_id
floor_number
name
description
created_at
updated_at
```

Relationship:

Hotel has many Floors.

---

# 19. Room Types

```sql
room_types

id
hotel_id
name
description
base_price
max_guests
bed_type
room_size
created_at
updated_at
```

Example:

Deluxe King

Ocean View Suite

Executive Suite

Presidential Suite

---

# 20. Rooms

```sql
rooms

id
floor_id
room_type_id
room_number
status
model_key
created_at
updated_at
```

Possible statuses:

available

maintenance

disabled

---

# 21. Amenities

```sql
amenities

id
name
icon
```

Examples:

Wi-Fi

Air Conditioning

Smart TV

Bathtub

Breakfast

Balcony

Ocean View

Room Service

---

# 22. Room Amenities

Create many-to-many relation:

```sql
room_amenities

room_id
amenity_id
```

---

# 23. Bookings

Create:

```sql
bookings

id
booking_reference
room_id

guest_name
guest_email
guest_phone

check_in
check_out

number_of_guests

nightly_price
subtotal
tax_amount
total_amount

status

created_at
updated_at
```

Booking statuses:

pending

confirmed

cancelled

completed

---

# 24. Booking Availability Logic

This is extremely important.

Do not allow double booking.

Before creating a booking:

validate that the room does not have an overlapping confirmed or pending booking.

For requested:

check_in
check_out

detect overlapping reservations.

Implement the logic on the backend.

Use PostgreSQL transactions.

The booking operation must be concurrency-safe.

Do not rely on frontend availability checking alone.

Use appropriate PostgreSQL locking or exclusion constraints where useful.

---

# 25. Booking Reference

Generate a human-readable booking reference.

Example:

```text
HTL-20260820-X8KD3
```

Do not expose sequential internal database IDs as booking references.

---

# 26. Pricing

Backend calculates all prices.

Frontend must never be trusted for totals.

Calculate:

nightly rate

number of nights

subtotal

tax

total

Example:

```text
nightly_price = 7900

nights = 3

subtotal = 23700

tax = 1659

total = 25359
```

Keep pricing logic inside backend services.

---

# 27. Seed Data

Create development seed data.

Create one hotel.

Example:

AURORA GRAND HOTEL

8 floors.

Each floor should contain several rooms.

Use realistic mock room types:

Deluxe King

Premier Twin

Ocean View Suite

Executive Suite

Presidential Suite

Seed amenities.

Seed approximately 40-60 rooms.

This data should automatically make the interactive hotel usable during development.

---

# 28. Frontend API Layer

Do not call fetch randomly throughout components.

Create a centralized API layer.

Example:

```text
services/

hotel.service.ts
floor.service.ts
room.service.ts
booking.service.ts
```

Create shared TypeScript interfaces.

Example:

Hotel

Floor

Room

RoomType

Amenity

Booking

Availability

---

# 29. 3D Data Integration

The Three.js scene must use data coming from the backend.

Example:

Backend:

Floor 7

Room 701

Room 702

Room 703

Frontend should map these database entities to 3D objects.

Each 3D room should know its backend room ID.

Example concept:

```text
3D Mesh
     ↓
roomId
     ↓
API
     ↓
PostgreSQL
```

Do not hardcode room data permanently inside Three.js components.

---

# 30. Model Mapping

Prepare support for GLTF/GLB models.

Database rooms can have:

```text
model_key
```

Example:

```text
deluxe-king-v1

ocean-suite-v1

executive-suite-v2
```

Frontend maps model_key to 3D assets.

Example:

```text
/models/rooms/ocean-suite-v1.glb
```

This should allow changing room models without changing booking data.

---

# 31. React Three Fiber Architecture

Create reusable components.

Example:

```text
HotelCanvas

HotelScene

HotelBuilding

HotelFloor

HotelRoom

RoomInterior

CameraController

Lighting

Environment

FloorHighlight

RoomHighlight
```

UI components:

```text
HeroSection

FloorSelector

RoomSelector

RoomInfoPanel

BookingPanel

AvailabilityForm

LoadingScreen
```

---

# 32. Application State

Do not create one giant component.

Use clean state management.

Track states such as:

```text
HOTEL_VIEW

FLOOR_VIEW

ROOM_VIEW

ROOM_INTERIOR

BOOKING
```

Example navigation:

```text
HOTEL_VIEW

    ↓

FLOOR_VIEW

    ↓

ROOM_VIEW

    ↓

ROOM_INTERIOR

    ↓

BOOKING
```

Camera behavior should react to application state.

---

# 33. Smooth Scrolling

Use Lenis.

Integrate Lenis correctly with GSAP ScrollTrigger.

Avoid:

* duplicate animation loops
* excessive requestAnimationFrame handlers
* scroll synchronization bugs

Ensure ScrollTrigger refreshes correctly.

---

# 34. Performance

3D performance is extremely important.

Implement:

* lazy loading
* dynamic imports
* Suspense
* Draco compression support
* optimized GLB loading
* texture compression readiness
* responsive DPR
* object reuse
* mesh instancing where appropriate

Avoid excessive real-time shadows.

Do not unnecessarily rerender React components every animation frame.

---

# 35. Mobile Experience

Desktop should provide the full experience.

Mobile should gracefully simplify 3D complexity.

Possible mobile optimizations:

* lower DPR
* simplified lighting
* fewer shadows
* reduced geometry
* reduced camera effects
* simplified transitions

Do not completely remove functionality.

Users must still be able to:

select floors

select rooms

view room details

book rooms

---

# 36. Reduced Motion

Respect:

prefers-reduced-motion

When enabled:

reduce camera movement

disable aggressive parallax

disable long scroll animations

replace them with simple transitions.

---

# 37. Docker

Create Docker configuration.

Services:

```text
web

api

postgres
```

Use Docker Compose.

Example development setup:

```text
docker compose up
```

should start the entire system.

---

# 38. PostgreSQL Docker Configuration

Example environment variables:

```text
POSTGRES_DB=hotel_booking
POSTGRES_USER=hotel
POSTGRES_PASSWORD=hotel_dev_password
```

Do not hardcode production passwords.

Use `.env`.

Create:

`.env.example`

Never commit real secrets.

---

# 39. Backend Environment Variables

Example:

```text
APP_ENV=development

API_PORT=8080

DATABASE_URL=

CORS_ALLOWED_ORIGINS=

JWT_SECRET=

TAX_RATE=
```

Validate required environment variables during startup.

---

# 40. Frontend Environment Variables

Example:

```text
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Do not place secrets inside NEXT_PUBLIC variables.

---

# 41. Database Migrations

Create migration commands.

Examples:

```bash
make migrate-up

make migrate-down
```

Also provide:

```bash
make seed
```

Use a well-maintained migration tool.

---

# 42. Makefile

Create useful commands such as:

```bash
make dev

make build

make test

make lint

make db-up

make db-down

make migrate-up

make migrate-down

make seed
```

---

# 43. API Error Format

Return consistent JSON errors.

Example:

```json
{
  "error": {
    "code": "ROOM_NOT_AVAILABLE",
    "message": "The selected room is unavailable for these dates."
  }
}
```

Do not expose internal stack traces.

---

# 44. Validation

Validate:

check-in date

check-out date

guest count

email

room status

room capacity

booking availability

Ensure:

check_out > check_in

Guests must not exceed room capacity.

Do validation on the backend.

---

# 45. Security

Implement basic production security practices.

Include:

input validation

parameterized queries

secure HTTP headers

CORS configuration

rate limiting where appropriate

request size limits

environment-based secrets

Do not construct SQL using string concatenation.

---

# 46. Logging

Implement structured backend logging.

Log:

server startup

database connection

request errors

booking creation

booking cancellation

unexpected failures

Do not log sensitive payment information or passwords.

---

# 47. Database Indexes

Add sensible PostgreSQL indexes.

Especially for:

rooms.floor_id

rooms.room_type_id

bookings.room_id

bookings.check_in

bookings.check_out

booking_reference

guest_email

Analyze booking availability queries and index accordingly.

---

# 48. Loading Experience

3D models may take time to load.

Create a premium loading screen.

Example:

```text
AURORA GRAND

Loading your experience

72%
```

Preload critical hotel assets.

Lazy load room interiors where possible.

---

# 49. Visual Design

Use a luxury visual direction.

Suggested style:

warm neutral colors

black

off-white

gold accents

large editorial typography

minimal navigation

glass overlays

cinematic full-screen imagery

Avoid excessive gradients.

Avoid neon gaming aesthetics.

---

# 50. Navigation

Create minimal navigation:

Hotel

Rooms

Experience

Booking

Contact

Navigation should remain subtle over the 3D experience.

---

# 51. Development Priorities

Implement in this order.

PHASE 1

Project architecture

Docker

PostgreSQL

Backend connection

Database migrations

Seed data

Basic APIs

PHASE 2

Next.js shell

Hotel homepage

Basic 3D hotel geometry

Camera

Lighting

PHASE 3

GSAP scroll animation

Hotel zoom

Floor selection

PHASE 4

Connect floors to backend data

Room selection

Room API integration

PHASE 5

Room interior

Camera room transition

Room information UI

PHASE 6

Availability API

Booking API

Booking interface

PHASE 7

Concurrency-safe booking logic

Validation

Error handling

PHASE 8

Mobile

Accessibility

Performance

Polish

---

# 52. First Version Requirement

Do NOT spend excessive time creating perfect 3D assets.

For version one:

Create the hotel using procedural geometry.

Represent floors using boxes.

Represent rooms using simple geometry.

Focus first on:

correct architecture

camera movement

floor interaction

room interaction

API integration

PostgreSQL integration

booking correctness

After the interaction system works correctly, real GLB/GLTF assets can replace placeholders.

---

# 53. Testing

Backend tests should cover at minimum:

room availability

overlapping bookings

non-overlapping bookings

invalid dates

guest capacity

booking price calculation

booking creation

booking cancellation

API validation

Add frontend tests where useful.

---

# 54. Verification

Before considering implementation complete:

Run frontend lint.

Run TypeScript checking.

Run frontend production build.

Run Go tests.

Run Go static checks.

Run database migrations from an empty database.

Run seed data.

Start the entire stack using Docker Compose.

Verify frontend can communicate with backend.

Verify rooms are fetched from PostgreSQL.

Verify availability checking.

Verify booking creation.

Verify double-booking prevention.

Fix all errors.

Do not claim the project is complete unless these checks pass.

---

# 55. Documentation

Create a detailed README.

Include:

project overview

architecture

technology stack

folder structure

local setup

environment variables

Docker instructions

PostgreSQL setup

migration commands

seed commands

frontend development

backend development

production build

API overview

3D model replacement instructions

Explain how another developer can clone the repository and run:

```bash
docker compose up
```

with minimal setup.

---

# 56. Important Engineering Rules

Do not create fake implementations just to make the UI look finished.

Do not hardcode hotel availability.

Do not calculate trusted prices only on the frontend.

Do not allow frontend state to determine whether a room can be booked.

PostgreSQL and the Go backend are the authoritative source for:

rooms

availability

bookings

pricing

Do not create unnecessary abstractions.

Keep the code understandable for another developer.

Prefer maintainability over cleverness.

---

# 57. Final Goal

The completed platform should feel like a combination of:

Luxury Hotel Website

*

Interactive Architectural Visualization

*

Modern Hotel Booking Platform

The user should visually experience:

Outside Hotel

↓ scroll

Hotel Building

↓ zoom

Select Floor

↓ zoom

Select Room

↓ enter

Explore Room Interior

↓ inspect

Room Details

↓ select dates

Availability

↓ booking

Reservation Confirmation

The 3D experience must enhance the booking experience rather than make booking difficult.

The backend and PostgreSQL architecture must be production-ready enough that the mock hotel can later be replaced with a real hotel business and real room inventory.

                   INTERNET
                      │
                      ▼
┌─────────────────────────────────────────┐
│              Next.js Web                │
│                                         │
│  Three.js + R3F + GSAP + ScrollTrigger │
│                                         │
│ 🏨 Hotel → Floor → Room → Interior     │
└──────────────────┬──────────────────────┘
                   │ REST API
                   ▼
┌─────────────────────────────────────────┐
│                 Go API                  │
│                                         │
│ Handler → Service → Repository         │
│                                         │
│ Availability / Pricing / Booking       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   PostgreSQL    │
          │                 │
          │ hotels          │
          │ floors          │
          │ rooms           │
          │ room_types      │
          │ bookings        │
          │ amenities       │
          └─────────────────┘
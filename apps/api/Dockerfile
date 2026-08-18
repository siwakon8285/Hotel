# ===================================
# Aurora Grand Hotel API — Dockerfile
# ===================================
# Multi-stage build เพื่อให้ image เล็กและปลอดภัย

# --- Stage 1: Build ---
FROM golang:1.26-alpine AS builder

WORKDIR /build

# คัดลอก go.mod และ go.sum ก่อน เพื่อ cache dependency layer
COPY apps/api/go.mod apps/api/go.sum ./
RUN go mod download

# คัดลอก source code ทั้งหมด
COPY apps/api/ ./

# Build binary แบบ static — ไม่ต้องพึ่ง libc ใน runtime image
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# --- Stage 2: Runtime ---
FROM alpine:3.21

# ติดตั้ง ca-certificates สำหรับ HTTPS และ tzdata สำหรับ timezone
RUN apk --no-cache add ca-certificates tzdata

# ตั้ง timezone เป็น UTC
ENV TZ=UTC

WORKDIR /app

# คัดลอก binary จาก builder stage
COPY --from=builder /server .

# รันด้วย non-root user เพื่อความปลอดภัย
RUN adduser -D -g '' appuser
USER appuser

EXPOSE 8080

CMD ["./server"]

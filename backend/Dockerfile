# CHANGE THIS LINE (Was 1.21, now 1.24)
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Set build options
ENV CGO_ENABLED=0
ENV GOOS=linux

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build
RUN go build -o main ./cmd/api/main.go

# Stage 2: Run
FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache tzdata

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
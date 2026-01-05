# 🏋️‍♂️ FitJourney - Professional Workout Logger

![FitJourney Banner](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&h=400&q=80)

> **A full-stack fitness tracking platform built for serious lifters.**  
> Featuring session-based logging, performance analytics, nutrition guides, and a "Hardcore" dark-mode UI.

[![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![Gin](https://img.shields.io/badge/Gin-Framework-00ADD8?logo=go&logoColor=white)](https://gin-gonic.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 🚀 Features

### 💪 **Workout Tracking (Session-Based)**
- **Smart Logging:** Track Weight, Sets, and Reps for multiple exercises grouped into specific sessions (e.g., "Leg Day").
- **Auto-Fill Templates:** Pre-built templates for Chest, Back, Legs, Shoulders, etc., that auto-populate the logging form.
- **Validation:** Strict input validation to ensure integrity of data (prevents empty sets/reps).

### 📊 **Advanced Analytics**
- **Consistency Heatmap:** Visual bar charts tracking volume consistency per day, week, and month.
- **Strength Progression:** Interactive line charts showing max weight increase over time for specific exercises.
- **PR Wall:** Automatically calculates and displays **Personal Records (1RM)** for every lift based on history.

### 🍎 **Nutrition & Resources**
- **Dynamic Guides:** Toggleable guides for Bulking, Cutting, and Maintenance.
- **Visual Food Lists:** High-quality imagery distinguishing "Fuel" foods vs "Trash" foods.
- **Supplement Store:** Curated stack recommendations with **INR (₹)** pricing and direct Amazon India shopping links.
- **Warm-up Library:** Integrated video guides for Upper, Lower, and Full Body mobility routines.

### 🎨 **UI/UX**
- **"Hardcore" Theme:** Custom Black & Red aesthetic using Tailwind CSS v4 variables.
- **Interactive Elements:** Pulse-effect WhatsApp widget for personal training inquiries.
- **Responsive Design:** Fully optimized layout for Mobile and Desktop users.

---

## 🛠️ Tech Stack

### **Backend (Go / Golang)**
- **Framework:** Gin (HTTP Web Framework)
- **Database ORM:** GORM (Object Relational Mapper)
- **Database:** PostgreSQL 15
- **Auth:** JWT (JSON Web Tokens) with Bcrypt hashing
- **Architecture:** Clean Architecture (Handlers -> Services -> Repositories)

### **Frontend (React)**
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (using `@theme` and `bg-linear-to-*`)
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios with Interceptors (Auto-logout on 401)

### **DevOps**
- **Containerization:** Docker (Multi-stage builds for Go & Node)
- **Orchestration:** Docker Compose
- **Proxy:** Nginx (Reverse Proxy for API routing)
- **Base Images:** Alpine Linux (for minimal footprint)

---

## 📂 Project Structure

```text
workout-logger/
├── docker-compose.yml           # Orchestrates Backend, Frontend, and Database
├── .gitignore                   # Git exclusion rules
├── README.md                    # Documentation
│
├── backend/                     # Go (Gin) API
│   ├── Dockerfile               # Multi-stage build (Golang -> Alpine)
│   ├── go.mod                   # Module definition
│   ├── go.sum                   # Checksums
│   ├── cmd/
│   │   └── api/
│   │       └── main.go          # Entry point
│   └── internal/
│       ├── database/
│       │   └── db.go            # Postgres connection & Migration
│       ├── handlers/            # HTTP Controllers
│       │   ├── auth_handler.go
│       │   └── workout_handler.go
│       ├── middleware/
│       │   └── auth_middleware.go # JWT Protection
│       ├── models/              # GORM Structs
│       │   ├── user.go
│       │   └── workout.go       # Session & Exercise Structs
│       ├── repository/          # Database Queries
│       │   ├── user_repository.go
│       │   └── workout_repository.go
│       ├── services/            # Business Logic
│       │   ├── auth_service.go
│       │   └── workout_service.go
│       └── utils/               # Helpers
│           ├── jwt.go
│           └── password.go
│
└── frontend/                    # React (Vite) Client
    ├── Dockerfile               # Multi-stage build (Node -> Nginx)
    ├── nginx.conf               # Reverse Proxy Config
    ├── package.json             # JS Dependencies
    ├── vite.config.js           # Vite Config (Proxy & Tailwind)
    ├── index.html               # HTML Entry
    └── src/
        ├── main.jsx             # React Entry
        ├── App.jsx              # Routing & Layout
        ├── index.css            # Tailwind Global Styles
        ├── api.js               # Axios Instance
        ├── Navbar.jsx           # Navigation Component
        ├── components/
        │   └── WhatsAppFloat.jsx # Chat Widget
        └── pages/
            ├── Login.jsx        # Auth Page
            ├── Register.jsx     # Auth Page
            ├── Dashboard.jsx    # Charts & Stats
            ├── Programs.jsx     # Templates & Warmups
            ├── Logger.jsx       # Workout Logging
            ├── History.jsx      # Session History
            └── Nutrition.jsx    # Guides & Store

## How to Run

### 1.Clone the Project
```bash
git clone https://github.com/aymanrafeeq/workout-logger.git
cd workout-logger
```

## 2.Set Environment Configuration

The application relies on environment variables for database access and authentication.

### Create `.env` File

Create a `.env` file in the **root directory** and add the following:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=workout_user
DB_PASS=workout_pass
DB_NAME=workout_db
DB_SSLMODE=disable

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=24h

```
---

## 3.Running the Project with Docker compose

This project is fully containerized and can be started using **Docker Compose**.

```bash
docker compose up --build -d
```
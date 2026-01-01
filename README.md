# 🏋️‍♂️ FitJourney - Professional Workout Logger

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
- **Smart Logging:** Track Weight, Sets, and Reps for multiple exercises in a single session.
- **Auto-Fill Templates:** One-click templates for Chest Day, Leg Day, Back Day, etc.
- **Validation:** Strict input validation to prevent incomplete data entries.

### 📊 **Advanced Analytics**
- **Consistency Heatmap:** Visual bar charts tracking volume per day/week/month.
- **Strength Progression:** Line charts showing max weight increase over time for specific exercises.
- **PR Wall:** Automatically calculates and displays **Personal Records** (1RM) for every lift.

### 🍎 **Nutrition & Resources**
- **Dynamic Guides:** Switch between Bulking, Cutting, and Maintenance modes.
- **Visual Food Lists:** Categorized lists for "Eat This" vs "Avoid That".
- **Supplement Store:** Curated stack recommendations with **INR (₹)** pricing and direct shopping links.
- **Warm-up Library:** Integrated video guides for Upper, Lower, and Full Body mobility.

### 🎨 **UI/UX**
- **"Hardcore" Theme:** Custom Black & Red aesthetic using Tailwind CSS v4 variables.
- **Interactive Elements:** Floating WhatsApp widget for personal training inquiries.
- **Responsive Design:** Fully optimized for Mobile and Desktop.

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

---

## ⚡ Quick Start (Docker)

The entire application (Frontend + Backend + DB) is dockerized. You can run it with **one command**.

### Prerequisites
- Docker & Docker Compose installed.

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/aymanrafeeq/workout-logger.git
   cd workout-logger

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
    

Access the App

    Frontend: http://localhost (Port 80)

    Backend API: http://localhost:8080
    

 📂 Project Structure
code Text
  
workout-logger/
├── backend/
│   ├── cmd/api/main.go          # Entry point
│   ├── internal/
│   │   ├── database/            # Postgres connection & Migration
│   │   ├── handlers/            # HTTP Controllers (Gin)
│   │   ├── middleware/          # JWT Auth Middleware
│   │   ├── models/              # GORM Structs (User, Session, Exercise)
│   │   ├── repository/          # Database Queries
│   │   └── services/            # Business Logic
│   └── Dockerfile               # Multi-stage Go build
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI (WhatsAppFloat, Navbar)
│   │   ├── pages/               # Dashboard, Logger, History, Nutrition
│   │   ├── api.js               # Axios config with Interceptors
│   │   └── App.jsx              # Routing & Layout
│   ├── nginx.conf               # Nginx Reverse Proxy Config
│   └── Dockerfile               # React Build + Nginx setup
│
└── docker-compose.yml           # Orchestration for DB, Backend, Frontend

    
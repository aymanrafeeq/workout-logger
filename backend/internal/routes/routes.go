package routes

import (
	"fitJourney/internal/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/health", handlers.HealthCheck)
}

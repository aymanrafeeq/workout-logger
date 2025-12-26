package routes

import (
	"fitJourney/internal/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/health", handlers.HealthCheck)

	r.POST("/workouts", handlers.AddWorkout)
	r.GET("/workouts", handlers.GetWorkouts)
	r.PUT("/workouts/:id", handlers.UpdateWorkout)
	r.DELETE("/workouts/:id", handlers.DeleteWorkout)

}

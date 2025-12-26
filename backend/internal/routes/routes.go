package routes

import (
	"fitJourney/internal/handlers"
	"fitJourney/internal/repository"
	"fitJourney/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/health", handlers.HealthCheck)

	repo := repository.NewWorkoutRepository()
	service := services.NewWorkoutService(repo)
	handler := handlers.NewWorkoutHandler(service)

	r.POST("/workouts", handler.AddWorkout)
	r.GET("/workouts", handler.GetWorkouts)
	r.PUT("/workouts/:id", handler.UpdateWorkout)
	r.DELETE("/workouts/:id", handler.DeleteWorkout)

}

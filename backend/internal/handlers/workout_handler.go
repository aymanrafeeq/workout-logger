package handlers

import (
	"fitJourney/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

var workouts []models.Workout

func AddWorkout(c *gin.Context) {
	var workout models.Workout

	if err := c.ShouldBindJSON(&workout); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	workout.ID = len(workouts) + 1
	workouts = append(workouts, workout)

	c.JSON(http.StatusCreated, workout)
}

func GetWorkouts(c *gin.Context) {
	c.JSON(http.StatusOK, workouts)
}

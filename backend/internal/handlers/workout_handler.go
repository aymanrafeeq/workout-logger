package handlers

import (
	"fitJourney/internal/models"
	"net/http"
	"strconv"

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

func UpdateWorkout(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workout ID"})
		return
	}

	for i, w := range workouts {
		if w.ID == id {
			var updatedWorkout models.Workout
			if err := c.ShouldBindJSON(&updatedWorkout); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			updatedWorkout.ID = id

			workouts[i] = updatedWorkout

			c.JSON(http.StatusOK, updatedWorkout)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "workout not found"})
}

func DeleteWorkout(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workout ID"})
		return
	}

	for i, w := range workouts {
		if w.ID == id {

			workouts = append(workouts[:i], workouts[i+1:]...)

			c.JSON(http.StatusOK, gin.H{"message": "Workout deleted successfully"})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "workout not found"})
}

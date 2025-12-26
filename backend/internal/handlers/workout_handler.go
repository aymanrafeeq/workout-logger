package handlers

import (
	"fitJourney/internal/models"
	"fitJourney/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WorkoutHandler struct {
	service services.WorkoutService
}

func NewWorkoutHandler(service services.WorkoutService) *WorkoutHandler {
	return &WorkoutHandler{service: service}
}

// POST /workouts
func (h *WorkoutHandler) AddWorkout(c *gin.Context) {
	var workout models.Workout

	if err := c.ShouldBindJSON(&workout); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateWorkout(&workout); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create workout"})
		return
	}

	c.JSON(http.StatusCreated, workout)
}

// GET /workouts
func (h *WorkoutHandler) GetWorkouts(c *gin.Context) {
	workouts, err := h.service.GetAllWorkouts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch workouts"})
		return
	}

	c.JSON(http.StatusOK, workouts)
}

// PUT /workouts/:id
func (h *WorkoutHandler) UpdateWorkout(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workout ID"})
		return
	}

	var updated models.Workout
	if err := c.ShouldBindJSON(&updated); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	workout, err := h.service.UpdateWorkout(uint(id), &updated)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, workout)
}

// DELETE /workouts/:id
func (h *WorkoutHandler) DeleteWorkout(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workout ID"})
		return
	}

	if err := h.service.DeleteWorkout(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Workout deleted successfully"})
}

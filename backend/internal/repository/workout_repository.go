package repository

import (
	"fitJourney/internal/database"
	"fitJourney/internal/models"
)

type WorkoutRepository interface {
	Create(workout *models.Workout) error
	FindAll() ([]models.Workout, error)
	FindByID(id uint) (*models.Workout, error)
	Update(workout *models.Workout) error
	Delete(workout *models.Workout) error
}

type workoutRepository struct{}

func NewWorkoutRepository() WorkoutRepository {
	return &workoutRepository{}
}

func (r *workoutRepository) Create(workout *models.Workout) error {
	return database.DB.Create(workout).Error
}

func (r *workoutRepository) FindAll() ([]models.Workout, error) {
	var workouts []models.Workout
	err := database.DB.Find(&workouts).Error
	return workouts, err
}

func (r *workoutRepository) FindByID(id uint) (*models.Workout, error) {
	var workout models.Workout
	err := database.DB.First(&workout, id).Error
	return &workout, err
}

func (r *workoutRepository) Update(workout *models.Workout) error {
	return database.DB.Save(workout).Error
}

func (r *workoutRepository) Delete(workout *models.Workout) error {
	return database.DB.Delete(workout).Error
}

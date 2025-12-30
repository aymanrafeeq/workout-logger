package repository

import (
	"fitJourney/internal/database"
	"fitJourney/internal/models"
)

type WorkoutRepository interface {
	Create(session *models.WorkoutSession) error
	FindAll() ([]models.WorkoutSession, error)
	FindByUserID(userID uint) ([]models.WorkoutSession, error)
	FindByID(id uint) (*models.WorkoutSession, error)
	Update(session *models.WorkoutSession) error
	Delete(session *models.WorkoutSession) error
}

type workoutRepository struct{}

func NewWorkoutRepository() WorkoutRepository {
	return &workoutRepository{}
}

func (r *workoutRepository) Create(workout *models.WorkoutSession) error {
	return database.DB.Create(workout).Error
}

func (r *workoutRepository) FindAll() ([]models.WorkoutSession, error) {
	var sessions []models.WorkoutSession
	err := database.DB.Preload("Exercises").Find(&sessions).Error
	return sessions, err
}

func (r *workoutRepository) FindByUserID(userID uint) ([]models.WorkoutSession, error) {
	var sessions []models.WorkoutSession
	err := database.DB.
		Preload("Exercises"). // <--- CRITICAL: Loads the exercises inside the session
		Where("user_id = ?", userID).
		Order("date desc"). // Sort by newest first
		Find(&sessions).Error
	return sessions, err
}

func (r *workoutRepository) FindByID(id uint) (*models.WorkoutSession, error) {
	var session models.WorkoutSession
	err := database.DB.
		Preload("Exercises").
		First(&session, id).Error
	return &session, err
}

func (r *workoutRepository) Update(session *models.WorkoutSession) error {
	return database.DB.Save(session).Error
}

func (r *workoutRepository) Delete(session *models.WorkoutSession) error {
	return database.DB.Delete(session).Error
}

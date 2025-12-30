package services

import (
	"errors"

	"fitJourney/internal/models"
	"fitJourney/internal/repository"
)

type WorkoutService interface {
	CreateWorkout(session *models.WorkoutSession) error
	GetAllWorkouts() ([]models.WorkoutSession, error)
	GetWorkoutsByUser(userID uint) ([]models.WorkoutSession, error)
	UpdateWorkout(id uint, updated *models.WorkoutSession) (*models.WorkoutSession, error)
	DeleteWorkout(id uint) error
}

type workoutService struct {
	repo repository.WorkoutRepository
}

func NewWorkoutService(repo repository.WorkoutRepository) WorkoutService {
	return &workoutService{repo: repo}
}

// CREATE
func (s *workoutService) CreateWorkout(workout *models.WorkoutSession) error {
	return s.repo.Create(workout)
}

// READ
func (s *workoutService) GetAllWorkouts() ([]models.WorkoutSession, error) {
	return s.repo.FindAll()
}

func (s *workoutService) GetWorkoutsByUser(userID uint) ([]models.WorkoutSession, error) {
	return s.repo.FindByUserID(userID)
}

// UPDATE
func (s *workoutService) UpdateWorkout(id uint, updated *models.WorkoutSession) (*models.WorkoutSession, error) {
	session, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("workout not found")
	}

	session.Name = updated.Name
	session.Date = updated.Date

	if len(updated.Exercises) > 0 {
		session.Exercises = updated.Exercises
	}

	if err := s.repo.Update(session); err != nil {
		return nil, err
	}

	return session, nil
}

// DELETE
func (s *workoutService) DeleteWorkout(id uint) error {
	session, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("workout not found")
	}

	return s.repo.Delete(session)
}

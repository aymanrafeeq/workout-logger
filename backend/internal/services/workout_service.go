package services

import (
	"errors"

	"fitJourney/internal/models"
	"fitJourney/internal/repository"
)

type WorkoutService interface {
	CreateWorkout(workout *models.Workout) error
	GetAllWorkouts() ([]models.Workout, error)
	UpdateWorkout(id uint, updated *models.Workout) (*models.Workout, error)
	DeleteWorkout(id uint) error
}

type workoutService struct {
	repo repository.WorkoutRepository
}

func NewWorkoutService(repo repository.WorkoutRepository) WorkoutService {
	return &workoutService{repo: repo}
}

// CREATE
func (s *workoutService) CreateWorkout(workout *models.Workout) error {
	return s.repo.Create(workout)
}

// READ
func (s *workoutService) GetAllWorkouts() ([]models.Workout, error) {
	return s.repo.FindAll()
}

// UPDATE
func (s *workoutService) UpdateWorkout(id uint, updated *models.Workout) (*models.Workout, error) {
	workout, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("workout not found")
	}

	workout.Exercise = updated.Exercise
	workout.Sets = updated.Sets
	workout.Reps = updated.Reps
	workout.Weight = updated.Weight
	workout.Date = updated.Date

	if err := s.repo.Update(workout); err != nil {
		return nil, err
	}

	return workout, nil
}

// DELETE
func (s *workoutService) DeleteWorkout(id uint) error {
	workout, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("workout not found")
	}

	return s.repo.Delete(workout)
}

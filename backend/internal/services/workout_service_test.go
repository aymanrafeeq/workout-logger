package services

import (
	"errors"
	"testing"

	"fitJourney/internal/models"
)

// -------------------- MOCK REPOSITORY --------------------

type mockWorkoutRepo struct {
	workouts map[uint]*models.Workout
	nextID   uint
}

func newMockRepo() *mockWorkoutRepo {
	return &mockWorkoutRepo{
		workouts: make(map[uint]*models.Workout),
		nextID:   1,
	}
}

func (m *mockWorkoutRepo) Create(workout *models.Workout) error {
	workout.ID = m.nextID
	m.workouts[m.nextID] = workout
	m.nextID++
	return nil
}

func (m *mockWorkoutRepo) FindAll() ([]models.Workout, error) {
	var list []models.Workout
	for _, w := range m.workouts {
		list = append(list, *w)
	}
	return list, nil
}

func (m *mockWorkoutRepo) FindByID(id uint) (*models.Workout, error) {
	w, ok := m.workouts[id]
	if !ok {
		return nil, errors.New("workout not found")
	}
	return w, nil
}

func (m *mockWorkoutRepo) Update(workout *models.Workout) error {
	if _, ok := m.workouts[workout.ID]; !ok {
		return errors.New("workout not found")
	}
	m.workouts[workout.ID] = workout
	return nil
}

func (m *mockWorkoutRepo) Delete(workout *models.Workout) error {
	if _, ok := m.workouts[workout.ID]; !ok {
		return errors.New("workout not found")
	}
	delete(m.workouts, workout.ID)
	return nil
}

// -------------------- TEST CASES --------------------

// Test CREATE workout
func TestCreateWorkout(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	workout := &models.Workout{
		Exercise: "Bench Press",
		Sets:     3,
		Reps:     10,
		Weight:   60,
		Date:     "2025-01-01",
	}

	err := service.CreateWorkout(workout)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if workout.ID == 0 {
		t.Fatalf("expected workout ID to be set")
	}
}

// Test GET ALL workouts
func TestGetAllWorkouts(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	_ = service.CreateWorkout(&models.Workout{Exercise: "Squat"})
	_ = service.CreateWorkout(&models.Workout{Exercise: "Deadlift"})

	workouts, err := service.GetAllWorkouts()
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if len(workouts) != 2 {
		t.Fatalf("expected 2 workouts, got %d", len(workouts))
	}
}

// Test UPDATE workout
func TestUpdateWorkout(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	_ = service.CreateWorkout(&models.Workout{
		Exercise: "Bench",
		Sets:     3,
	})

	updated := &models.Workout{
		Exercise: "Bench Press",
		Sets:     4,
		Reps:     8,
	}

	workout, err := service.UpdateWorkout(1, updated)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if workout.Exercise != "Bench Press" {
		t.Fatalf("expected updated exercise name")
	}
}

// Test UPDATE non-existing workout
func TestUpdateWorkout_NotFound(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	_, err := service.UpdateWorkout(99, &models.Workout{Exercise: "Test"})
	if err == nil {
		t.Fatalf("expected error for non-existing workout")
	}
}

// Test DELETE workout
func TestDeleteWorkout(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	_ = service.CreateWorkout(&models.Workout{Exercise: "Squat"})

	err := service.DeleteWorkout(1)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

// Test DELETE non-existing workout
func TestDeleteWorkout_NotFound(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	err := service.DeleteWorkout(42)
	if err == nil {
		t.Fatalf("expected error for non-existing workout")
	}
}

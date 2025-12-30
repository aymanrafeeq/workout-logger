package services

import (
	"errors"
	"testing"
	"time"

	"fitJourney/internal/models"
)

// -------------------- MOCK REPOSITORY --------------------

type mockWorkoutRepo struct {
	workouts map[uint]*models.WorkoutSession
	nextID   uint
}

func newMockRepo() *mockWorkoutRepo {
	return &mockWorkoutRepo{
		workouts: make(map[uint]*models.WorkoutSession),
		nextID:   1,
	}
}

func (m *mockWorkoutRepo) Create(workout *models.WorkoutSession) error {
	workout.ID = m.nextID
	m.workouts[m.nextID] = workout
	m.nextID++
	return nil
}

func (m *mockWorkoutRepo) FindAll() ([]models.WorkoutSession, error) {
	var list []models.WorkoutSession
	for _, w := range m.workouts {
		list = append(list, *w)
	}
	return list, nil
}

func (m *mockWorkoutRepo) FindByUserID(userID uint) ([]models.WorkoutSession, error) {
	return []models.WorkoutSession{}, nil
}

func (m *mockWorkoutRepo) FindByID(id uint) (*models.WorkoutSession, error) {
	w, ok := m.workouts[id]
	if !ok {
		return nil, errors.New("workout not found")
	}
	return w, nil
}

func (m *mockWorkoutRepo) Update(workout *models.WorkoutSession) error {
	if _, ok := m.workouts[workout.ID]; !ok {
		return errors.New("workout not found")
	}
	m.workouts[workout.ID] = workout
	return nil
}

func (m *mockWorkoutRepo) Delete(workout *models.WorkoutSession) error {
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

	workout := &models.WorkoutSession{
		Name: "Chest Day", // Was 'Exercise'
		Date: time.Now(),
		Exercises: []models.WorkoutExercise{
			{
				Name:   "Bench Press",
				Sets:   3,
				Reps:   10,
				Weight: 60,
			},
		},
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

	_ = service.CreateWorkout(&models.WorkoutSession{Name: "Leg Day"})
	_ = service.CreateWorkout(&models.WorkoutSession{Name: "Back Day"})

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

	_ = service.CreateWorkout(&models.WorkoutSession{
		Name: "Morning Workout",
	})

	updated := &models.WorkoutSession{
		Name: "Evening Workout", // We are updating the Session Name
	}

	workout, err := service.UpdateWorkout(1, updated)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if workout.Name != "Evening Workout" {
		t.Fatalf("expected updated workout name")
	}
}

// Test UPDATE non-existing workout
func TestUpdateWorkout_NotFound(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	_, err := service.UpdateWorkout(99, &models.WorkoutSession{Name: "Test"})
	if err == nil {
		t.Fatalf("expected error for non-existing workout")
	}
}

// Test DELETE workout
func TestDeleteWorkout(t *testing.T) {
	repo := newMockRepo()
	service := NewWorkoutService(repo)

	_ = service.CreateWorkout(&models.WorkoutSession{Name: "Squat Session"})

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

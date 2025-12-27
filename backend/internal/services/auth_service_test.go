package services

import (
	"testing"

	"fitJourney/internal/models"
	"fitJourney/internal/repository"

	"gorm.io/gorm"
)

// ---- Mock Repository ----

type mockUserRepository struct {
	users map[string]models.User
}

func newMockUserRepo() repository.UserRepository {
	return &mockUserRepository{
		users: make(map[string]models.User),
	}
}

func (m *mockUserRepository) Create(user *models.User) error {
	m.users[user.Email] = *user
	return nil
}

func (m *mockUserRepository) FindByEmail(email string) (*models.User, error) {
	user, ok := m.users[email]
	if !ok {
		return nil, gorm.ErrRecordNotFound
	}
	return &user, nil
}

func (m *mockUserRepository) FindByID(id uint) (*models.User, error) {
	for _, user := range m.users {
		if user.ID == id {
			return &user, nil
		}
	}
	return nil, gorm.ErrRecordNotFound
}

func TestAuthService_Register_Success(t *testing.T) {
	repo := newMockUserRepo()
	service := NewAuthService(repo)

	err := service.Register("user", "test@example.com", "password123")

	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

func TestAuthService_Register_UserAlreadyExists(t *testing.T) {
	repo := newMockUserRepo()
	service := NewAuthService(repo)

	_ = service.Register("user", "test@example.com", "password123")
	err := service.Register("user", "test@example.com", "password123")

	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

func TestAuthService_Login_Success(t *testing.T) {
	repo := newMockUserRepo()
	service := NewAuthService(repo)

	err := service.Register("user", "test@example.com", "password123")
	if err != nil {
		t.Fatalf("register failed: %v", err)
	}

	user, err := service.Login("test@example.com", "password123")

	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}

	if user.Email != "test@example.com" {
		t.Errorf("expected email test@example.com, got %s", user.Email)
	}
}

func TestAuthService_Login_WrongPassword(t *testing.T) {
	repo := newMockUserRepo()
	service := NewAuthService(repo)

	_ = service.Register("user", "test@example.com", "password123")

	_, err := service.Login("test@example.com", "wrongpassword")

	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

func TestAuthService_Login_UserNotFound(t *testing.T) {
	repo := newMockUserRepo()
	service := NewAuthService(repo)

	_, err := service.Login("unknown@example.com", "password123")

	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

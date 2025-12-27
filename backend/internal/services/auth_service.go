package services

import (
	"errors"

	"fitJourney/internal/models"
	"fitJourney/internal/repository"
	"fitJourney/internal/utils"

	"gorm.io/gorm"
)

// AuthService handles authentication logic
type AuthService struct {
	userRepo repository.UserRepository
}

// Constructor
func NewAuthService(userRepo repository.UserRepository) *AuthService {
	return &AuthService{userRepo}
}

// Register creates a new user
func (s *AuthService) Register(name, email, password string) error {

	// Check if user already exists
	_, err := s.userRepo.FindByEmail(email)
	if err == nil {
		return errors.New("user already exists")
	}

	// If error is not record not found, return error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return err
	}

	user := models.User{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
	}

	return s.userRepo.Create(&user)
}

// Login verifies user credentials
func (s *AuthService) Login(email, password string) (*models.User, error) {

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Compare password
	if err := utils.CheckPassword(user.Password, password); err != nil {
		return nil, errors.New("invalid email or password")
	}

	return user, nil
}

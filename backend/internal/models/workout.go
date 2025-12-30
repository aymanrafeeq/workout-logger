package models

import (
	"time"

	"gorm.io/gorm"
)

type WorkoutSession struct {
	gorm.Model
	ID        uint              `gorm:"primaryKey" json:"id"`
	UserID    uint              `json:"-" gorm:"not null"`
	Name      string            `json:"name"` // e.g., "Pull Day"	Weight    float64           `json:"weight"`
	Date      time.Time         `json:"date"`
	Duration  int               `json:"duration_minutes"`
	Exercises []WorkoutExercise `gorm:"foreignKey:SessionID;constraint:OnDelete:CASCADE;" json:"exercises"`
}

// An "Exercise" represents one movement done inside a session
type WorkoutExercise struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	SessionID uint    `json:"-"`    // Foreign Key
	Name      string  `json:"name"` // e.g., "Bench Press"
	Sets      int     `json:"sets"`
	Reps      int     `json:"reps"`
	Weight    float64 `json:"weight"`
}

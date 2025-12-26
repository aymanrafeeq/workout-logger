package models

import "gorm.io/gorm"

type Workout struct {
	gorm.Model
	Exercise string  `json:"exercise"`
	Sets     int     `json:"sets"`
	Reps     int     `json:"reps"`
	Weight   float64 `json:"weight"`
	Date     string  `json:"date"`
}

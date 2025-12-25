package models

type Workout struct {
	ID       int     `json:"id"`
	Exercise string  `json:"exercise"`
	Sets     int     `json:"sets"`
	Reps     int     `json:"reps"`
	Weight   float64 `json:"weight"`
	Date     string  `json:"date"`
}

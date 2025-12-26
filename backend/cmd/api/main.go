package main

import (
	"fitJourney/internal/database"
	"fitJourney/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	database.ConnectDatabase()

	routes.RegisterRoutes(r)
	r.Run(":8080")
}

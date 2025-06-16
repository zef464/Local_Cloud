package main

import (
	"cloud_on_go/handlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Настройка CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"}, // Vite порты
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Ваши существующие маршруты
	r.POST("/upload", handlers.UploadFile)
	r.GET("/files", handlers.ListFiles)
	r.GET("/download/:filename", handlers.DownloadFile)
	r.DELETE("/delete/:filename", handlers.DeleteFile)

	r.Run(":8080")
}

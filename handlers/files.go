package handlers

import (
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func UploadFile(c *gin.Context) {
	tgID := c.GetString("telegram_id")

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File error"})
		return
	}
	defer file.Close()

	userDir := filepath.Join("data", tgID)
	_ = os.MkdirAll(userDir, 0755)

	dstPath := filepath.Join(userDir, header.Filename)
	out, err := os.Create(dstPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save file"})
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded"})
}

func ListFiles(c *gin.Context) {
	tgID := c.GetString("telegram_id")
	userDir := filepath.Join("data", tgID)

	files, err := os.ReadDir(userDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot list files"})
		return
	}

	names := []string{}
	for _, f := range files {
		names = append(names, f.Name())
	}

	c.JSON(http.StatusOK, gin.H{"files": names})
}

func DownloadFile(c *gin.Context) {
	tgID := c.GetString("telegram_id")
	filename := c.Param("filename")
	path := filepath.Join("data", tgID, filename)
	c.File(path)
}

func DeleteFile(c *gin.Context) {
	tgID := c.GetString("telegram_id")
	filename := c.Param("filename")
	path := filepath.Join("data", tgID, filename)
	err := os.Remove(path)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot delete file"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

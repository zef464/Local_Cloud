// package middleware

// import (
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// )

// func AuthMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		tgID := c.GetHeader("X-Telegram-ID")
// 		if tgID == "" {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Telegram ID"})
// 			return
// 		}

// 		// Подписку можно проверять по БД. Для примера:
// 		if !IsSubscribed(tgID) {
// 			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Subscription inactive"})
// 			return
// 		}

// 		c.Set("telegram_id", tgID)
// 		c.Next()
// 	}
// }

// func IsSubscribed(tgID string) bool {
// 	// Заглушка. Заменить на проверку в твоей БД или кэше
// 	subscribedIDs := map[string]bool{
// 		"1353152381": true, // пример Telegram ID
// 	}
// 	return subscribedIDs[tgID]
// }

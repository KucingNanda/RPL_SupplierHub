package controllers

import (
	"os"
	"time"

	"supplierhub-api/database"
	"supplierhub-api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"detail": "Invalid request"})
	}

	var user models.User
	result := database.DB.Where("username = ?", req.Username).First(&user)
	if result.Error != nil || user.Password != req.Password {
		return c.Status(401).JSON(fiber.Map{"detail": "Kredensial salah"})
	}

	// Generate JWT Token
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("JWT_SECRET")
	t, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"detail": "Gagal generate token"})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"token":  t,
		"user": fiber.Map{
			"id":       user.ID,
			"name":     user.Name,
			"role":     user.Role,
			"username": user.Username,
		},
	})
}

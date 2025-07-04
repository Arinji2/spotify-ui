// Package env provides typesafe environent variables.
package env

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

type Spotify struct {
	ClientSecret string
	ClientID     string
}

type Env struct {
	Spotify     Spotify
	APISecret   string
	FrontendURL string
}

func loadEnv(envName string) string {
	val := os.Getenv(envName)
	if val == "" {
		log.Fatalf("Environment variable %s is empty", envName)
	}
	return val
}

func SetupEnv() *Env {
	log.Println("Loading environment variables...")
	clientSecret := loadEnv("SPOTIFY_CLIENT_SECRET")
	clientID := loadEnv("SPOTIFY_CLIENT_ID")
	apiSecret := loadEnv("API_SECRET")
	frontendURL := loadEnv("FRONTEND_URL")

	log.Println("Environment variables loaded.")
	return &Env{
		Spotify: Spotify{
			ClientSecret: clientSecret,
			ClientID:     clientID,
		},
		APISecret:   apiSecret,
		FrontendURL: frontendURL,
	}
}

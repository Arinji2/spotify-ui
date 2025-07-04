package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/arinji2/spotify-ui-api/internal/cache"
	"github.com/arinji2/spotify-ui-api/route"
)

func main() {
	cache := cache.NewInMemoryCache()
	srv := &http.Server{
		Addr:    ":8080",
		Handler: route.RegisterRoutes(cache),
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Println("Starting server on port 8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	<-stop
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	isDebug := os.Getenv("DEBUG") == "true"
	if !isDebug {
		cache.SaveToFile()
	}

	log.Println("Server exited gracefully")
}

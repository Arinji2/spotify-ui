package main

import (
	"log"
	"net/http"

	"github.com/arinji2/spotify-ui-api/route"
)

func main() {
	srv := http.Server{
		Addr:    ":8080",
		Handler: route.RegisterRoutes(),
	}

	log.Println("Starting server on port 8080")
	err := srv.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}

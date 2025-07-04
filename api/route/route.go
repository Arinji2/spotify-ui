// Package route provides HTTP routes for the API using openapi-spec.
package route

import (
	"net/http"
	"time"

	"github.com/arinji2/spotify-ui-api/handler"
	"github.com/arinji2/spotify-ui-api/internal/cache"
	"github.com/arinji2/spotify-ui-api/internal/gen"
	"github.com/arinji2/spotify-ui-api/internal/httpmiddleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func RegisterRoutes(cache *cache.InMemoryCache) http.Handler {
	h := handler.NewHandler(cache)

	r := chi.NewRouter()

	r.Use(middleware.RealIP)
	r.Use(httpmiddleware.Cors)
	r.Use(httpmiddleware.SecretAuthMiddleware())
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Heartbeat("/ping"))
	r.Use(middleware.Timeout(60 * time.Second))

	server := gen.NewStrictHandler(h, nil)

	gen.HandlerFromMux(server, r)

	return r
}

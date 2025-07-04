// Package handler provides HTTP handlers for the API using openapi-spec.
package handler

import (
	"github.com/arinji2/spotify-ui-api/internal/cache"
	"github.com/arinji2/spotify-ui-api/internal/env"
)

type Handler struct {
	Env   *env.Env
	Cache *cache.InMemoryCache
}

func NewHandler(cache *cache.InMemoryCache) *Handler {
	env := env.SetupEnv()
	return &Handler{
		Env:   env,
		Cache: cache,
	}
}

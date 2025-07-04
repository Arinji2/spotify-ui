// Package handler provides HTTP handlers for the API using openapi-spec.
package handler

import "github.com/arinji2/spotify-ui-api/internal/cache/env"

type Handler struct {
	Env *env.Env
}

func NewHandler() *Handler {
	env := env.SetupEnv()
	return &Handler{
		Env: env,
	}
}

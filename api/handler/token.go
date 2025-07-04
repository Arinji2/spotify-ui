package handler

import (
	"context"
	"os"

	"github.com/arinji2/spotify-ui-api/internal/gen"
)

func (h *Handler) GetToken(ctx context.Context, request gen.GetTokenRequestObject) (gen.GetTokenResponseObject, error) {
	expected := os.Getenv("API_SECRET")

	if request.Params.Secret != expected {
		return gen.GetToken401JSONResponse{
			Error: "Invalid secret",
		}, nil
	}

	// Do Stuff
	return gen.GetToken200JSONResponse{
		AccessToken: "mock-token",
		ExpiresIn:   3600,
		TokenType:   "Bearer",
	}, nil
}

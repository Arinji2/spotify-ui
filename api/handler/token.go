package handler

import (
	"context"
	"os"

	"github.com/arinji2/spotify-ui-api/gen"
)

func (h *Handler) GetToken(ctx context.Context, request gen.GetTokenRequestObject) (gen.GetTokenResponseObject, error) {
	expected := os.Getenv("API_SECRET")

	if request.Params.Secret != expected {
		return gen.GetToken401JSONResponse{
			Error: "Invalid secret",
		}, nil
	}

	// Respond with a token — you can plug in real logic here
	return gen.GetToken200JSONResponse{
		AccessToken: "mock-token",
		ExpiresIn:   3600,
		TokenType:   "Bearer",
	}, nil
}

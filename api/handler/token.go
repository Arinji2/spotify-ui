package handler

import (
	"context"
	"fmt"

	"github.com/arinji2/spotify-ui-api/internal/gen"
	"github.com/arinji2/spotify-ui-api/internal/openapi"
	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2/clientcredentials"
)

func (h *Handler) GetToken(ctx context.Context, request gen.GetTokenRequestObject) (gen.GetTokenResponseObject, error) {
	config := &clientcredentials.Config{
		ClientID:     h.Env.Spotify.ClientID,
		ClientSecret: h.Env.Spotify.ClientSecret,
		TokenURL:     spotifyauth.TokenURL,
	}

	httpClient := config.Client(ctx)

	client := spotify.New(httpClient)
	token, err := client.Token()
	if err != nil {
		return openapi.InternalError(fmt.Errorf("error with getting token: %v", err).Error(), "Error With Authenticating to Spotify"), nil
	}

	return gen.GetToken200JSONResponse{
		AccessToken: token.AccessToken,
		ExpiresIn:   int(token.Expiry.Unix()),
	}, nil
}

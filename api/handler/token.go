package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/arinji2/spotify-ui-api/internal/gen"
	"github.com/arinji2/spotify-ui-api/internal/openapi"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2/clientcredentials"
)

func (h *Handler) GetToken(ctx context.Context, request gen.GetTokenRequestObject) (gen.GetTokenResponseObject, error) {
	data, exists := h.Cache.Get("token")
	if exists {
		var cachedToken gen.Token
		if err := json.Unmarshal(data, &cachedToken); err != nil {
			return openapi.InternalError[gen.GetToken500JSONResponse](fmt.Errorf("unmarshal cached token: %w", err).Error(), "Error With Authenticating to Spotify"), nil
		}

		log.Println("Using cached token")
		return gen.GetToken200JSONResponse(cachedToken), nil
	}

	config := &clientcredentials.Config{
		ClientID:     h.Env.Spotify.ClientID,
		ClientSecret: h.Env.Spotify.ClientSecret,
		TokenURL:     spotifyauth.TokenURL,
	}

	token, err := config.Token(ctx)
	if err != nil {
		return openapi.InternalError[gen.GetToken500JSONResponse](fmt.Errorf("get token from Spotify: %w", err).Error(), "Error With Authenticating to Spotify"), nil
	}

	expiryUnix := int(token.Expiry.Unix())
	tokenData := gen.Token{
		AccessToken: token.AccessToken,
		Expiry:      expiryUnix,
	}

	data, err = json.Marshal(tokenData)
	if err != nil {
		return openapi.InternalError[gen.GetToken500JSONResponse](fmt.Errorf("marshal token: %w", err).Error(), "Error With Authenticating to Spotify"), nil
	}

	cacheDuration := time.Until(token.Expiry)
	h.Cache.Set("token", data, cacheDuration)

	log.Printf("Cached token until %v", token.Expiry)
	return gen.GetToken200JSONResponse(tokenData), nil
}

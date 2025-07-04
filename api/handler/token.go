package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/arinji2/spotify-ui-api/internal/gen"
	"github.com/arinji2/spotify-ui-api/internal/openapi"
	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2/clientcredentials"
)

func (h *Handler) GetToken(ctx context.Context, request gen.GetTokenRequestObject) (gen.GetTokenResponseObject, error) {
	data, exists := h.Cache.Get("token")
	if exists {
		tokenData := gen.Token{}
		err := json.Unmarshal(data, &tokenData)
		if err != nil {
			return openapi.InternalError(fmt.Errorf("error with marhsallign cached token: %v", err).Error(), "Error With Authenticating to Spotify"), nil
		}

		log.Println("Using cached token")
		return gen.GetToken200JSONResponse{
			AccessToken: tokenData.AccessToken,
			Expiry:      int(tokenData.Expiry),
		}, nil
	}

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

	tokenDuration := time.Until(token.Expiry)
	tokenData := gen.Token{
		AccessToken: token.AccessToken,
		Expiry:      int(token.Expiry.Unix()),
	}
	data, err = json.Marshal(tokenData)
	if err != nil {
		return openapi.InternalError(fmt.Errorf("error with marshalling token: %v", err).Error(), "Error With Authenticating to Spotify"), nil
	}

	log.Printf("Saving token to cache for duration %fh:%fm:%fs", tokenDuration.Hours(), tokenDuration.Minutes(), tokenDuration.Seconds())
	h.Cache.Set("token", data, tokenDuration)

	return gen.GetToken200JSONResponse{
		AccessToken: token.AccessToken,
		Expiry:      int(token.Expiry.Unix()),
	}, nil
}

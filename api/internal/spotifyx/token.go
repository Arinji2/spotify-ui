package spotifyx

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/arinji2/spotify-ui-api/internal/gen"
	"github.com/zmb3/spotify"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2/clientcredentials"
)

func (s *Spotify) GetToken(ctx context.Context, clientID, clientSecret string) (gen.Token, error) {
	data, exists := s.Cache.Get("token")
	if exists {
		var cachedToken gen.Token
		if err := json.Unmarshal(data, &cachedToken); err != nil {
			return gen.Token{}, err
		}

		log.Println("Using cached token")
		return cachedToken, nil
	}
	config := &clientcredentials.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		TokenURL:     spotifyauth.TokenURL,
	}

	httpClient := config.Client(ctx)

	client := spotify.NewClient(httpClient)
	token, err := client.Token()
	if err != nil {
		return gen.Token{}, err
	}

	expiryUnix := int(token.Expiry.Unix())
	tokenData := gen.Token{
		AccessToken: token.AccessToken,
		Expiry:      expiryUnix,
	}

	data, err = json.Marshal(tokenData)
	if err != nil {
		return gen.Token{}, err
	}

	cacheDuration := time.Until(token.Expiry)
	s.Cache.Set("token", data, cacheDuration)

	log.Printf("Cached token")
	return tokenData, nil
}

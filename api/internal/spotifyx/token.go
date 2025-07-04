package spotifyx

import (
	"context"
	"encoding/json"
	"log"
	"time"

	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

type Token struct {
	AccessToken string `json:"access_token"`
	Expiry      int    `json:"expiry"`
}

func (s *Spotify) GetToken(ctx context.Context) (oauth2.Token, error) {
	data, exists := s.Cache.Get("token")
	if exists {
		var cachedToken oauth2.Token
		if err := json.Unmarshal(data, &cachedToken); err != nil {
			return oauth2.Token{}, err
		}

		log.Println("Using cached token")
		return cachedToken, nil
	}
	config := &clientcredentials.Config{
		ClientID:     s.ClientID,
		ClientSecret: s.ClientSecret,
		TokenURL:     spotifyauth.TokenURL,
	}

	token, err := config.Token(ctx)
	if err != nil {
		log.Fatalf("couldn't get token: %v", err)
	}

	data, err = json.Marshal(token)
	if err != nil {
		return oauth2.Token{}, err
	}

	cacheDuration := time.Until(token.Expiry)
	s.Cache.Set("token", data, cacheDuration)

	log.Printf("Cached token")
	return *token, nil
}

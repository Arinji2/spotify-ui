package spotifyx

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/zmb3/spotify"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
	"golang.org/x/oauth2/clientcredentials"
)

type Token struct {
	AccessToken string `json:"access_token"`
	Expiry      int    `json:"expiry"`
}

func (s *Spotify) GetToken(ctx context.Context) (Token, error) {
	data, exists := s.Cache.Get("token")
	if exists {
		var cachedToken Token
		if err := json.Unmarshal(data, &cachedToken); err != nil {
			return Token{}, err
		}

		log.Println("Using cached token")
		return cachedToken, nil
	}
	config := &clientcredentials.Config{
		ClientID:     s.ClientID,
		ClientSecret: s.ClientSecret,
		TokenURL:     spotifyauth.TokenURL,
	}

	httpClient := config.Client(ctx)

	client := spotify.NewClient(httpClient)
	token, err := client.Token()
	if err != nil {
		return Token{}, err
	}

	expiryUnix := int(token.Expiry.Unix())
	tokenData := Token{
		AccessToken: token.AccessToken,
		Expiry:      expiryUnix,
	}

	data, err = json.Marshal(tokenData)
	if err != nil {
		return Token{}, err
	}

	cacheDuration := time.Until(token.Expiry)
	s.Cache.Set("token", data, cacheDuration)

	log.Printf("Cached token")
	return tokenData, nil
}

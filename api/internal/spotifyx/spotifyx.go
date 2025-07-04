// Package spotifyx provides primitives to interact with the spotify API.
package spotifyx

import "github.com/arinji2/spotify-ui-api/internal/cache"

type Spotify struct {
	ClientID     string
	ClientSecret string
	Cache        *cache.InMemoryCache
}

func NewSpotify(clientID, clientSecret string, cache *cache.InMemoryCache) *Spotify {
	return &Spotify{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Cache:        cache,
	}
}

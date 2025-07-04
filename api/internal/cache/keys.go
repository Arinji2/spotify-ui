package cache

import "fmt"

// Key represents a type-safe cache key.
type Key struct {
	K string
}

// Playlist returns the cache key for a specific playlist ID.
func Playlist(id string) Key {
	return Key{fmt.Sprintf("playlist-%s", id)}
}

// Token is the cache key for the Spotify token.
var Token = Key{"token"}

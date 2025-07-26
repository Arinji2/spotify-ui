package handler

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/arinji2/spotify-ui-api/internal/cache"
	"github.com/arinji2/spotify-ui-api/internal/gen"
	"github.com/arinji2/spotify-ui-api/internal/logx"
	"github.com/arinji2/spotify-ui-api/internal/openapi"
	"github.com/arinji2/spotify-ui-api/internal/spotifyx"
	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

func (h *Handler) GetArtist(ctx context.Context, request gen.GetArtistRequestObject) (gen.GetArtistResponseObject, error) {
	artistID := request.ArtistId
	data, exists := h.Cache.Get(cache.Artist(artistID))
	if exists {
		var cachedArtist gen.Artist
		if err := json.Unmarshal(data, &cachedArtist); err != nil {
			return gen.GetArtist500JSONResponse{
				InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
					Error:          fmt.Errorf("unmarshal cached artist with ID-%s : %w", artistID, err).Error(),
					DisplayMessage: openapi.StringPtr("Error With Getting Artist"),
				},
			}, nil
		}

		logx.Debug("Using cached artist for %s", cache.Artist(artistID).K)
		return gen.
			GetArtist200JSONResponse(cachedArtist), nil
	}

	spotifyAuth := spotifyx.NewSpotify(h.Env.Spotify.ClientID, h.Env.Spotify.ClientSecret, h.Cache)
	token, err := spotifyAuth.GetToken(ctx)
	if err != nil {
		return gen.GetArtist500JSONResponse{
			InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
				Error:          fmt.Errorf("error getting token for artistID %s : %w", artistID, err).Error(),
				DisplayMessage: openapi.StringPtr("Error With Authenticating With Spotify"),
			},
		}, nil
	}

	// add token to client
	httpClient := spotifyauth.New().Client(ctx, &token)
	client := spotify.New(httpClient)

	artistData, err := client.GetArtist(ctx, spotify.ID(artistID))
	if err != nil {
		return gen.GetArtist500JSONResponse{
			InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
				Error:          fmt.Errorf("error getting artist %s : %w", artistID, err).Error(),
				DisplayMessage: openapi.StringPtr("Error With Getting Artist"),
			},
		}, nil
	}

	formattedArtist := gen.Artist{
		Id:     string(artistData.ID),
		Name:   artistData.Name,
		Images: []gen.Image{},
	}

	for _, image := range artistData.Images {
		formattedArtist.Images = append(formattedArtist.Images, gen.Image{
			Url:    image.URL,
			Height: int(image.Height),
			Width:  int(image.Width),
		})
	}

	data, err = json.Marshal(formattedArtist)
	if err != nil {
		return gen.GetArtist500JSONResponse{
			InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
				Error:          fmt.Errorf("error marshalling artist : %w", err).Error(),
				DisplayMessage: openapi.StringPtr("Error With Getting Playlist"),
			},
		}, nil
	}

	logx.Debug("Setting cache for %s", cache.Artist(artistID).K)
	h.Cache.Set(cache.Artist(artistID), data, cache.DefaultCacheDuration)

	return gen.GetArtist200JSONResponse(formattedArtist), nil
}

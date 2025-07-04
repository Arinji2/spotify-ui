package handler

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/arinji2/spotify-ui-api/internal/cache"
	"github.com/arinji2/spotify-ui-api/internal/contants"
	"github.com/arinji2/spotify-ui-api/internal/gen"
	"github.com/arinji2/spotify-ui-api/internal/openapi"
	"github.com/arinji2/spotify-ui-api/internal/spotifyx"
	"github.com/zmb3/spotify/v2"
	spotifyauth "github.com/zmb3/spotify/v2/auth"
)

func (h *Handler) GetPlaylist(ctx context.Context, request gen.GetPlaylistRequestObject) (gen.GetPlaylistResponseObject, error) {
	playlistID := request.PlaylistId
	data, exists := h.Cache.Get(cache.Playlist(playlistID))
	if exists {
		var cachedPlaylist gen.Playlist
		if err := json.Unmarshal(data, &cachedPlaylist); err != nil {
			return gen.GetPlaylist500JSONResponse{
				InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
					Error:          fmt.Errorf("unmarshal cached playlist with ID-%s : %w", playlistID, err).Error(),
					DisplayMessage: openapi.StringPtr("Error With Getting Playlist"),
				},
			}, nil
		}

		return gen.GetPlaylist200JSONResponse(cachedPlaylist), nil
	}

	spotifyAuth := spotifyx.NewSpotify(h.Env.Spotify.ClientID, h.Env.Spotify.ClientSecret, h.Cache)
	token, err := spotifyAuth.GetToken(ctx)
	if err != nil {
		return gen.GetPlaylist500JSONResponse{
			InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
				Error:          fmt.Errorf("error getting token for playlistID %s : %w", playlistID, err).Error(),
				DisplayMessage: openapi.StringPtr("Error With Authenticating With Spotify"),
			},
		}, nil
	}

	// add token to client
	httpClient := spotifyauth.New().Client(ctx, &token)
	client := spotify.New(httpClient)

	playlistData, err := client.GetPlaylist(ctx, spotify.ID(playlistID))
	if err != nil {
		return gen.GetPlaylist500JSONResponse{
			InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
				Error:          fmt.Errorf("error getting playlist %s : %w", playlistID, err).Error(),
				DisplayMessage: openapi.StringPtr("Error With Getting Playlist"),
			},
		}, nil
	}

	formattedPlaylist := gen.Playlist{
		Id:          string(playlistData.ID),
		Name:        playlistData.Name,
		Description: playlistData.Description,
		Owner: gen.User{
			Id:          playlistData.Owner.ID,
			DisplayName: playlistData.Owner.DisplayName,
		},
	}

	for i, track := range playlistData.Tracks.Tracks {
		if i >= contants.SpotifyPlaylistMaxTracks {
			break
		}
		formattedPlaylist.Tracks.Items = append(formattedPlaylist.Tracks.Items, gen.PlaylistTrack{
			AddedAt: track.AddedAt,
			IsLocal: track.IsLocal,
			Track: gen.Track{
				Id:         string(track.Track.ID),
				Name:       track.Track.Name,
				DurationMs: int(track.Track.Duration),
			},
		})

		for _, artist := range track.Track.Artists {
			formattedPlaylist.Tracks.Items[i].Track.Artists = append(formattedPlaylist.Tracks.Items[i].Track.Artists, gen.Artist{
				Id:   string(artist.ID),
				Name: artist.Name,
			})
		}
	}

	for _, image := range playlistData.Images {
		formattedPlaylist.Images = append(formattedPlaylist.Images, gen.Image{
			Url:    image.URL,
			Height: int(image.Height),
			Width:  int(image.Width),
		})
	}

	data, err = json.Marshal(formattedPlaylist)
	if err != nil {
		return gen.GetPlaylist500JSONResponse{
			InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
				Error:          fmt.Errorf("error marshalling playlist : %w", err).Error(),
				DisplayMessage: openapi.StringPtr("Error With Getting Playlist"),
			},
		}, nil
	}

	h.Cache.Set(cache.Playlist(playlistID), data, cache.DefaultCacheDuration)

	return gen.GetPlaylist200JSONResponse(formattedPlaylist), nil
}

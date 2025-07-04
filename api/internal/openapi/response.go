// Package openapi provides primitives to interact with the openapi HTTP API.
package openapi

import "github.com/arinji2/spotify-ui-api/internal/gen"

func StringPtr(s string) *string {
	return &s
}

func InternalError(msg, userMsg string) gen.GetToken500JSONResponse {
	return gen.GetToken500JSONResponse{
		InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
			Error:          msg,
			DisplayMessage: StringPtr(userMsg),
		},
	}
}

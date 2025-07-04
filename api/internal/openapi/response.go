// Package openapi provides primitives to interact with the openapi HTTP API.
package openapi

import "github.com/arinji2/spotify-ui-api/internal/gen"

func StringPtr(s string) *string {
	return &s
}

func InternalError[T any](msg, userMsg string) T {
	var resp T
	switch v := any(&resp).(type) {
	case *gen.GetToken500JSONResponse:
		*v = gen.GetToken500JSONResponse{
			InternalErrorJSONResponse: gen.InternalErrorJSONResponse{
				Error:          msg,
				DisplayMessage: StringPtr(userMsg),
			},
		}
	default:
		panic("InternalError: unsupported response type")
	}
	return resp
}

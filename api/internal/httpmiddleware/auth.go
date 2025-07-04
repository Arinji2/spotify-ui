// Package httpmiddleware provides custom HTTP middleware for the API Routes.
package httpmiddleware

import (
	"encoding/json"
	"net/http"
	"os"
)

func SecretAuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			secretEnv := os.Getenv("API_SECRET")
			secret := r.URL.Query().Get("secret")
			if secret != secretEnv {
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]string{
					"error": "unauthorized",
				})
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

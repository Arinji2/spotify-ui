
.PHONY: generate
generate: ## Generate code from OpenAPI spec
	@oapi-codegen -config oapi-codegen.yaml openapi.yml
	@pnpx openapi-typescript openapi.yml -o ./frontend/generated/openapi-schema.d.ts


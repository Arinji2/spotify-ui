
.PHONY: generate
generate: ## Generate code from OpenAPI spec
	@oapi-codegen -config oapi-codegen.yaml openapi.yml


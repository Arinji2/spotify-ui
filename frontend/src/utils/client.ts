import createClient from "openapi-fetch";
import type { paths } from "@/../generated/openapi-schema";

export function getAPIClient() {
	const apiURL = process.env.API_URL;
	const client = createClient<paths>({ baseUrl: apiURL });
	return client;
}

import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getAPIClient } from "./client";

export const fetchArtist = createServerFn({ method: "GET" })
	.validator((d: string) => d)
	.handler(async ({ data: artistID }) => {
		const client = getAPIClient();
		const secretkey = process.env.SECRET_KEY!;
		const { data, error } = await client.GET("/api/artist/{artist_id}", {
			params: {
				query: {
					secret: secretkey,
				},
				path: {
					artist_id: artistID,
				},
			},
		});

		if (error) {
			console.error(error.error);
			throw new Error(error.display_message ?? "Something went wrong");
		}

		return data;
	});

export const artistQueryOptions = (artistID: string) =>
	queryOptions({
		queryKey: ["artist", artistID],
		queryFn: () => fetchArtist({ data: artistID }),
	});

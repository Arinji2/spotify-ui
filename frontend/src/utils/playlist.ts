import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getAPIClient } from "./client";

export const fetchPlaylist = createServerFn({ method: "GET" })
	.validator((d: string) => d)
	.handler(async ({ data: playlistID }) => {
		const client = getAPIClient();
		const secretkey = process.env.SECRET_KEY!;
		const { data, error } = await client.GET("/api/playlist/{playlist_id}", {
			params: {
				query: {
					secret: secretkey,
				},
				path: {
					playlist_id: playlistID,
				},
			},
		});

		if (error) {
			console.error(error.error);
			throw new Error(error.display_message ?? "Something went wrong");
		}

		return data;
	});

export const playlistQueryOptions = (playlistID: string) =>
	queryOptions({
		queryKey: ["playlist", playlistID],
		queryFn: () => fetchPlaylist({ data: playlistID }),
	});

import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";

export const createRouter = () => {
	const router = routerWithQueryClient(
		createTanstackRouter({
			routeTree,
			context: {
				// Modified according to https://github.com/TanStack/router/issues/4493#issuecomment-3032486341
				queryClient: TanstackQuery.getContext().queryClient,
			},
			scrollRestoration: true,
			defaultPreloadStaleTime: 0,
		}),
		TanstackQuery.getContext().queryClient,
	);

	return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}

import type { QueryClient } from "@tanstack/react-query";
import { $api } from "./client";

export function prefetchRequests(client: QueryClient) {
	const requestsOpts = $api.queryOptions(
		"get",
		"/api/request",
		{},
		{ staleTime: 60_000 },
	);
	return $api.prefetchQuery(client, requestsOpts);
}

export type HelpRequest = Awaited<ReturnType<typeof prefetchRequests>>[number];

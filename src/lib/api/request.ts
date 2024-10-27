import type { QueryClient } from "@tanstack/react-query";
import { $api } from "./client";

export function prefetchRequests(client: QueryClient, multiply = 1) {
	const requestsOpts = $api.queryOptions(
		"get",
		"/api/request",
		{},
		{ staleTime: 60_000 },
	);
	const data = $api.prefetchQuery(client, requestsOpts);
	if (multiply <= 1) {
		return data;
	}

	return data.then((requests) => {
		return requests.flatMap((request) =>
			Array.from({ length: multiply }, (_, i) => {
				return {
					...request,
					id: i === 0 ? request.id : `${request.id}-${i}`,
				};
			}),
		);
	});
}

export type HelpRequest = Awaited<ReturnType<typeof prefetchRequests>>[number];

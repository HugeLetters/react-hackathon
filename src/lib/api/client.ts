import type { FetchQueryOptions, QueryClient } from "@tanstack/react-query";
import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./spec";

const fetchClient = createFetchClient<paths>({
	baseUrl: import.meta.env.VITE_SERVER_HOST || "http://0.0.0.0:4040",
});

const authMiddleware: Middleware = {
	onRequest({ request }) {
		const token = localStorage.getItem("auth-token");
		if (!token) {
			return;
		}

		request.headers.append("Authorization", `Bearer ${token}`);
	},
};

fetchClient.use(authMiddleware);

const baseApi = createClient(fetchClient);

export const $api = {
	...baseApi,
	prefetchQuery<T>(client: QueryClient, opts: Opts<T>): Promise<T> {
		return client.fetchQuery(opts);
	},
	client: fetchClient,
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface Opts<T> extends FetchQueryOptions<T, undefined, T, any> {}

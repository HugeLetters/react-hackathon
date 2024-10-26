import type { FetchQueryOptions, QueryClient } from "@tanstack/react-query";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./spec";

const fetchClient = createFetchClient<paths>({
	baseUrl: import.meta.env.VITE_SERVER_HOST || "http://0.0.0.0:4040",
});
const baseApi = createClient(fetchClient);

export const $api = {
	...baseApi,
	async prefetchQuery<T>(client: QueryClient, opts: Opts<T>): Promise<T> {
		return (
			client.getQueryData(opts.queryKey) ?? (await client.fetchQuery(opts))
		);
	},
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface Opts<T> extends FetchQueryOptions<T, undefined, T, any> {}

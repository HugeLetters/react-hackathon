import { $api } from "@lib/api/client";
import { defineLoader } from "@lib/router/loader";

export const { loader, useLoaderData } = defineLoader(
	async ({ queryClient }) => {
		const requestsOpts = $api.queryOptions("get", "/api/request", {});
		const requests = await $api.prefetchQuery(queryClient, requestsOpts);
		return { requests };
	},
);

export function Component() {
	const { requests } = useLoaderData();

	console.log(requests);

	return <div>grid</div>;
}

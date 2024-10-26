import { $api } from "@lib/api/client";
import { defineLoader } from "@lib/router/loader";
import { Outlet } from "react-router-dom";

export const { loader, useLoaderData } = defineLoader(
	async ({ queryClient }) => {
		const requestsOpts = $api.queryOptions("get", "/api/request", {});
		const requests = await $api.prefetchQuery(queryClient, requestsOpts);

		return { requests };
	},
);

export function Component() {
	return (
		<div>
			<div>request search</div>
			<Outlet />
		</div>
	);
}

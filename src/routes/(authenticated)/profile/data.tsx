import { $api } from "@lib/api/client";
import { defineLoader } from "@lib/router/loader";

export const { loader, useLoaderData } = defineLoader(
	async ({ queryClient }) => {
		const userDataOpts = $api.queryOptions("get", "/api/user");

		return {
			userData: await $api.prefetchQuery(queryClient, userDataOpts),
		};
	},
);

export function Component() {
	const l = useLoaderData();
	const d = $api.useQuery("get", "/api/user");
	console.log(d.data);

	return <div>personal info - {JSON.stringify(d.data)}</div>;
}

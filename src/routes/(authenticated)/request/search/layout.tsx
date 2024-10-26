import { $api } from "@lib/api/client";
import { ErrorScreen } from "@lib/components/Error";
import { defineLoader } from "@lib/router/loader";
import type { PropsWithChildren } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

export const { loader, useLoaderData } = defineLoader(
	async ({ queryClient }) => {
		const requestsOpts = $api.queryOptions("get", "/api/request");
		const requests = await $api.prefetchQuery(queryClient, requestsOpts);

		return { requests };
	},
);

export function Component() {
	const data = useLoaderData();
	const context: RequestSearchContext = { data };

	return (
		<Layout>
			<Outlet context={context} />
		</Layout>
	);
}

function Layout({ children }: PropsWithChildren) {
	return (
		<div>
			<div>request search filter</div>
			<div>{children}</div>
		</div>
	);
}

export function ErrorBoundary() {
	return (
		<Layout>
			<ErrorScreen />
		</Layout>
	);
}

export function useRequestSearchContext() {
	return useOutletContext() as RequestSearchContext;
}

type RequestSearchContext = {
	data: ReturnType<typeof useLoaderData>;
};

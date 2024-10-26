import { $api } from "@lib/api/client";
import { ErrorScreen } from "@lib/components/Error";
import { defineLoader } from "@lib/router/loader";
import type { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

export const { loader, useLoaderData } = defineLoader(
	async ({ queryClient }) => {
		const requestsOpts = $api.queryOptions("get", "/api/request");
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

function Layout({ children }: PropsWithChildren) {
	return (
		<div>
			filters
			<div>{children}</div>
		</div>
	);
}

export function ErrorBoundary() {
	return <ErrorScreen />;
}

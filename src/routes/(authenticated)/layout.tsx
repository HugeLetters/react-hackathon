import { $api } from "@lib/api/client";
import { defineLoader } from "@lib/router/loader";
import { redirect } from "react-router-dom";

export const { loader } = defineLoader(async ({ queryClient }) => {
	const token = localStorage.getItem("auth-token");
	if (!token) {
		throw redirect("/auth/signin");
	}

	const userOpts = $api.queryOptions(
		"get",
		"/api/user",
		{},
		{
			retry(count, error_) {
				const error = error_ as { message: string } | undefined;
				if (error?.message === "No token provided.") {
					return false;
				}

				return count <= 3;
			},
		},
	);
	await $api.prefetchQuery(queryClient, userOpts).catch(() => {
		throw redirect("/auth/signin");
	});

	return null;
});

import { defineLoader } from "@lib/router/loader";

export const { loader, useLoaderData } = defineLoader(({ params }) => {
	const id = params.id;

	return { id };
});

export function Component() {
	const data = useLoaderData();

	return <div>request {data.id}</div>;
}

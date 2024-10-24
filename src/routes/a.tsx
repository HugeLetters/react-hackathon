import { defineLoader } from "@lib/router/loader";

const { loader, useLoaderData } = defineLoader(async () => {
	return await Promise.resolve({ a: "A" });
});

export { loader };

export function Component() {
	const data = useLoaderData();

	return (
		<>
			<h1>Page A</h1>
			<p>{data.a}</p>
		</>
	);
}

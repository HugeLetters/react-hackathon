import { defineLoader } from "@loader";

const { loader, useLoaderData } = defineLoader(async () => {
	return { a: "A" };
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

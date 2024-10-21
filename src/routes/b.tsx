import { defineLoader } from "@loader";

const { loader, useLoaderData } = defineLoader(async () => {
	return { b: "B" };
});

export { loader };

export function Component() {
	const data = useLoaderData();

	return (
		<>
			<h1>Page B</h1>
			<p>{data.b}</p>
		</>
	);
}

import { defineLoader } from "@loader";
import { redirect } from "react-router-dom";

const { loader, useLoaderData } = defineLoader(async ({ params }) => {
	const param = params.param;
	if (param === undefined) {
		throw redirect("/");
	}
	const numeric = +param;

	if (Number.isNaN(numeric)) {
		throw redirect("/");
	}

	return { data: numeric ** 2 };
});

export { loader };

export function Component() {
	const data = useLoaderData();

	return (
		<>
			<h1>Page with param</h1>
			<p>{data.data}</p>
		</>
	);
}

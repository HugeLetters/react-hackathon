import { type LoaderFunctionArgs, useLoaderData } from "react-router-dom";

type LoaderData<R> = R | Promise<R>;

export function defineLoader<R>(
	loader: (params: LoaderFunctionArgs) => LoaderData<R>,
) {
	return {
		loader,
		useLoaderData: useLoaderData as () => R,
	};
}

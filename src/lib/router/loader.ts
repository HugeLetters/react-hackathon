import type { QueryClient } from "@tanstack/react-query";
import { type LoaderFunctionArgs, useLoaderData } from "react-router-dom";

type LoaderData<R> = R | Promise<R>;
type Loader<R> = (params: LoaderFunctionArgs) => LoaderData<R>;
type ExtendedLoader<R> = (params: LoaderFunctionArgsExtended) => LoaderData<R>;

export function defineLoader<R>(loader: ExtendedLoader<R>) {
	return {
		loader,
		useLoaderData: useLoaderData as () => R,
	};
}

type LoaderContext = {
	queryClient: QueryClient;
};
interface LoaderFunctionArgsExtended
	extends LoaderFunctionArgs,
		LoaderContext {}

export function augmentRouterLoader<T>(
	loader: ExtendedLoader<T>,
	ctx: LoaderContext,
): Loader<T> {
	return function loader_(args: LoaderFunctionArgs) {
		return loader({ ...args, ...ctx });
	};
}

export function augmentRouterDataLoader(ctx: LoaderContext) {
	return function apply<T>(data: Record<"loader", ExtendedLoader<T>>) {
		return {
			...data,
			loader: augmentRouterLoader(data.loader, ctx),
		};
	};
}

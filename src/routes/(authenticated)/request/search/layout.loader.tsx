import { ErrorScreen } from "@lib/components/Error";
import { defineLoader } from "@lib/router/loader";
import { parseQueryModel } from "@lib/state/query";
import dayjs from "dayjs";
import { Outlet, useOutletContext } from "react-router-dom";
import {
	FilterModel,
	type FullFilter,
	type Nullish,
	type Request,
	ReuseRequestModel,
	SearchModel,
	isFilterEmpty,
	prefetchRequests,
} from "./layout.shared";

let prevFilteredRequests: Array<Request> | null = null;
let abort: AbortController | null;
export const { loader, useLoaderData } = defineLoader(
	async ({ request, queryClient }) => {
		let requests = await prefetchRequests(queryClient);
		const { searchParams } = new URL(request.url);
		const filter = parseQueryModel(searchParams, FilterModel);
		const search = parseQueryModel(searchParams, SearchModel);
		const deopt = searchParams.has("deopt");

		if (prevFilteredRequests && !deopt) {
			const reuse = parseQueryModel(searchParams, ReuseRequestModel);
			if (reuse["~reuseRequest"]) {
				requests = prevFilteredRequests;
			}
		}

		if (!deopt) {
			abort?.abort();
			abort = new AbortController();
		}

		const filteredRequests = await filterRequests(
			requests,
			{ ...filter, ...search },
			abort?.signal,
		);

		prevFilteredRequests = filteredRequests;

		return {
			requests: filteredRequests,
		};
	},
);

export function Component() {
	const data = useLoaderData();
	const context: RequestSearchContext = { data };
	return <Outlet context={context} />;
}

export function ErrorBoundary() {
	return <ErrorScreen />;
}

export function useRequestSearchContext() {
	return useOutletContext() as RequestSearchContext;
}

type RequestSearchContext = {
	data: ReturnType<typeof useLoaderData>;
};

async function filterRequests(
	requests: Array<Request>,
	filter: FullFilter,
	signal?: AbortSignal,
): Promise<Array<Request>> {
	if (isFilterEmpty(filter)) {
		return requests;
	}

	const filtered: Array<Request> = [];

	let chunkCount = 0;
	for (const request of requests) {
		chunkCount++;
		if (signal && chunkCount > 300) {
			chunkCount = 0;
			await new Promise<void>((r) => {
				setTimeout(r);
			});

			if (signal.aborted) {
				throw new Error("aborted");
			}
		}

		const { helperRequirements } = request;
		if (
			!isEqualsFilter(filter.help, request.helpType) ||
			!isEqualsFilter(filter.requester, request.requesterType) ||
			!isEqualsFilter(filter.helper, helperRequirements?.helperType) ||
			!isEqualsFilter(filter.isOnline, helperRequirements?.isOnline) ||
			!isEqualsFilter(filter.qualification, helperRequirements?.qualification)
		) {
			continue;
		}

		if (
			filter.until !== null &&
			dayjs(request.endingDate, "YYYY-MM-DD").unix() > filter.until.unix()
		) {
			continue;
		}

		if (filter.q !== null) {
			if (
				!request.title?.toLowerCase().includes(filter.q) ||
				!request.organization?.title?.toLowerCase().includes(filter.q)
			) {
				continue;
			}
		}

		filtered.push(request);
	}

	return filtered;
}

function isEqualsFilter<T>(filter: Nullish<T>, value: NoInfer<T>): boolean {
	return filter === null || filter === value;
}

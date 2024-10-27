import { ErrorScreen } from "@lib/components/Error";
import { defineLoader } from "@lib/router/loader";
import { parseQueryModel } from "@lib/state/query";
import { GridOnRounded, ListAltRounded, LocationOn } from "@mui/icons-material";
import {
	Box,
	Container,
	Paper,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import dayjs from "dayjs";
import type { PropsWithChildren } from "react";
import {
	type LinkProps,
	NavLink,
	Outlet,
	useLocation,
	useOutletContext,
} from "react-router-dom";
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

	return (
		<Layout requestCount={data.requests.length}>
			<Outlet context={context} />
		</Layout>
	);
}

export function ErrorBoundary() {
	return (
		<Layout>
			<ErrorScreen />
		</Layout>
	);
}

type LayoutProps = {
	requestCount?: number;
};
function Layout({
	requestCount = 0,
	children,
}: PropsWithChildren<LayoutProps>) {
	const { pathname } = useLocation();
	return (
		<Paper sx={{ padding: "1rem 3rem", height: "100%" }}>
			<Box display="flex" justifyContent="space-between">
				<Typography>Найдено {requestCount}</Typography>
				<ToggleButtonGroup value={pathname}>
					<NavButton aria-label="open grid view" to="/request/search/grid">
						<GridOnRounded />
					</NavButton>
					<NavButton to="/request/search/list" aria-label="open list view">
						<ListAltRounded />
					</NavButton>
					<NavButton to="/request/search/map" aria-label="open map view">
						<LocationOn />
					</NavButton>
				</ToggleButtonGroup>
			</Box>
			<Box height="100%">{children}</Box>
		</Paper>
	);
}

function NavButton({
	children,
	...props
}: PropsWithChildren<Pick<LinkProps, "to" | "aria-label">>) {
	return (
		<ToggleButton component={NavLink} {...props} to={props.to} value={props.to}>
			{children}
		</ToggleButton>
	);
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

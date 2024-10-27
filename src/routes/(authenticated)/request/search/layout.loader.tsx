import { type HelpRequest, prefetchRequests } from "@lib/api/request";
import { ErrorScreen } from "@lib/components/Error";
import { NoResultsScreen } from "@lib/components/NoResults/no-results";
import { defineLoader } from "@lib/router/loader";
import { parseQueryModel, useQueryModel } from "@lib/state/query";
import { GridOnRounded, ListAltRounded, LocationOn } from "@mui/icons-material";
import {
	Box,
	Button,
	Pagination,
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
	useRevalidator,
} from "react-router-dom";
import {
	FilterModel,
	type FullFilter,
	type Nullish,
	PageModel,
	ReuseRequestModel,
	SearchModel,
	isFilterEmpty,
} from "./layout.shared";

const PAGE_SIZE = 3;

let prevFilter: string | null;
let prevFilteredRequests: Array<HelpRequest> | null = null;
let abort: AbortController | null;
export const { loader, useLoaderData } = defineLoader(
	async ({ request, queryClient }) => {
		let requests = await prefetchRequests(queryClient);
		const { searchParams } = new URL(request.url);
		const { page, ...filter } = parseQueryModel(searchParams, {
			...FilterModel,
			...SearchModel,
			...PageModel,
		});

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

		const filterString = Object.entries(filter)
			.sort(([a], [b]) => (a > b ? 1 : -1))
			.join("|");

		const filteredRequests =
			!deopt && prevFilteredRequests && prevFilter === filterString
				? prevFilteredRequests
				: await filterRequests(requests, filter, abort?.signal);
		prevFilter = filterString;

		prevFilteredRequests = filteredRequests;

		const offset = (page - 1) * PAGE_SIZE;
		return {
			requests: filteredRequests,
			page: filteredRequests.slice(offset, offset + PAGE_SIZE),
		};
	},
);

export function Component() {
	const data = useLoaderData();
	const context: RequestSearchContext = { data };

	return (
		<Layout requestCount={data.requests.length}>
			{data.requests.length > 0 ? (
				<Outlet context={context} />
			) : (
				<NoResultsScreen message="Запросы не найдены" />
			)}
		</Layout>
	);
}

export function ErrorBoundary() {
	const { revalidate } = useRevalidator();
	return (
		<Layout>
			<Button onClick={revalidate}>
				<ErrorScreen />
			</Button>
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
	const [page, setPage] = useQueryModel(PageModel);

	return (
		<Paper
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				padding: "1rem 3rem",
			}}
		>
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
			<Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
				{requestCount > 0 ? (
					<Pagination
						page={page.page}
						count={Math.ceil(requestCount / 3)}
						onChange={(_, page) => setPage({ page })}
					/>
				) : null}
			</Box>
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
	requests: Array<HelpRequest>,
	filter: FullFilter,
	signal?: AbortSignal,
): Promise<Array<HelpRequest>> {
	if (isFilterEmpty(filter)) {
		return requests;
	}

	const filtered: Array<HelpRequest> = [];

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

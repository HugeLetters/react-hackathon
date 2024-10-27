import { $api } from "@lib/api/client";
import { ErrorScreen } from "@lib/components/Error";
import { defineLoader } from "@lib/router/loader";
import {
	type QueryModel,
	type QueryModelValue,
	defineQueryModel,
	parseQueryModel,
	useQueryModel,
} from "@lib/state/query";
import { Search as SearchIcon } from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Checkbox,
	type CheckboxProps,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid2,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { QueryClient } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import type { PropsWithChildren } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

// todo - cache filter

let prevFilteredRequests: Array<Request> | null = null;
export const { loader, useLoaderData } = defineLoader(
	async ({ request, queryClient }) => {
		let requests = await prefetchRequests(queryClient);
		const { searchParams } = new URL(request.url);
		const filter = parseQueryModel(searchParams, FilterModel);
		const search = parseQueryModel(searchParams, SearchModel);

		if (prevFilteredRequests) {
			const reuse = parseQueryModel(searchParams, ReuseRequestModel);
			if (reuse["~reuseRequest"]) {
				requests = prevFilteredRequests;
			}
		}

		const filteredRequests = filterRequests(requests, { ...filter, ...search });
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
		<Layout>
			<div>{data.requests.length}</div>
			<Outlet context={context} />
		</Layout>
	);
}

function Layout({ children }: PropsWithChildren) {
	return (
		<Box height="100%" paddingBlock="1rem">
			<Grid2 container size={12} height="100%">
				<Grid2 size={3}>
					<Typography variant="h4">Запросы о помощи</Typography>
					<Filters />
				</Grid2>
				<Grid2 size={9} height="100%">
					<Search />
					<Box height="100%">{children}</Box>
				</Grid2>
			</Grid2>
		</Box>
	);
}

function Search() {
	const [search, setSearch] = useQueryModel({
		...SearchModel,
		...ReuseRequestModel,
	});

	return (
		<Paper
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				padding: "2rem",
			}}
		>
			<Typography variant="h6">Найти запрос</Typography>
			<TextField
				fullWidth
				variant="standard"
				placeholder="Введите название задачи или организации"
				slotProps={{
					input: { startAdornment: <SearchIcon /> },
				}}
				value={search.q}
				onChange={(e) => {
					const { value } = e.currentTarget;
					const lowercase = value.toLowerCase();
					setSearch((prev) => {
						return {
							q: lowercase,
							"~reuseRequest": lowercase.includes(prev.q),
						};
					});
				}}
			/>
		</Paper>
	);
}

function Filters() {
	const { filter, setValue, createCheckboxHandler, reset } = useFilterModel();

	return (
		<Box>
			<FormGroup>
				<FormLabel>Комы мы помогаем</FormLabel>
				<FormControlLabel
					control={
						<Checkbox {...createCheckboxHandler("requester", "person")} />
					}
					label="Пенсионеры"
				/>
				<FormControlLabel
					control={
						<Checkbox {...createCheckboxHandler("requester", "organization")} />
					}
					label="Дома престарелых"
				/>
			</FormGroup>
			<FormGroup>
				<FormLabel>Чем мы помогаем</FormLabel>
				<FormControlLabel
					control={<Checkbox {...createCheckboxHandler("help", "material")} />}
					label="Вещи"
				/>
				<FormControlLabel
					control={<Checkbox {...createCheckboxHandler("help", "finance")} />}
					label="Финансирование"
				/>
			</FormGroup>

			<RequirementFilters />

			<FormControlLabel
				control={
					<DatePicker
						disablePast
						views={["year", "month", "day"]}
						value={filter.until}
						onChange={(value) => {
							setValue("until", value);
						}}
					/>
				}
				label="Помощь актуальна до:"
				labelPlacement="top"
			/>

			<Button disabled={isFilterEmpty(filter)} onClick={reset}>
				Сбросить
			</Button>
		</Box>
	);
}

function RequirementFilters() {
	const { createCheckboxHandler } = useFilterModel();
	return (
		<Accordion>
			<AccordionSummary>Волонтерство</AccordionSummary>
			<AccordionDetails>
				<FormGroup>
					<FormLabel>Специализация</FormLabel>
					<FormControlLabel
						control={
							<Checkbox
								{...createCheckboxHandler("qualification", "professional")}
							/>
						}
						label="Квалифицированная"
					/>
					<FormControlLabel
						control={
							<Checkbox {...createCheckboxHandler("qualification", "common")} />
						}
						label="Не требует профессии"
					/>
				</FormGroup>
				<FormGroup>
					<FormLabel>Формат</FormLabel>
					<FormControlLabel
						control={<Checkbox {...createCheckboxHandler("isOnline", true)} />}
						label="Онлайн"
					/>
					<FormControlLabel
						control={<Checkbox {...createCheckboxHandler("isOnline", false)} />}
						label="Офлайн"
					/>
				</FormGroup>
				<FormGroup>
					<FormLabel>Необходимо волонтеров</FormLabel>
					<FormControlLabel
						control={<Checkbox {...createCheckboxHandler("helper", "group")} />}
						label="Группа"
					/>
					<FormControlLabel
						control={
							<Checkbox {...createCheckboxHandler("helper", "single")} />
						}
						label="Один"
					/>
				</FormGroup>
			</AccordionDetails>
		</Accordion>
	);
}

export function ErrorBoundary() {
	return (
		<Layout>
			<ErrorScreen />
		</Layout>
	);
}

export function useRequestSearchContext() {
	return useOutletContext() as RequestSearchContext;
}

type RequestSearchContext = {
	data: ReturnType<typeof useLoaderData>;
};

const ReuseRequestModel = {
	"~reuseRequest": defineQueryModel<boolean>({
		transform: {
			from(param) {
				switch (param) {
					case "true":
						return true;
					default:
						return false;
				}
			},
			to(value) {
				switch (value) {
					case true:
						return "true";
					default:
						return "";
				}
			},
		},
	}),
} satisfies QueryModel;

const FilterModel = {
	requester: defineQueryModel<Nullish<Request["requesterType"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "person":
						return "person";
					case "organization":
						return "organization";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
	help: defineQueryModel<Nullish<Request["helpType"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "finance":
						return "finance";
					case "material":
						return "material";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
	until: defineQueryModel<Nullish<Dayjs>>({
		transform: {
			from(param) {
				if (!param) {
					return null;
				}

				const date = dayjs(param, "DD-MM-YYYY");

				if (!date.isValid()) {
					return null;
				}

				return date;
			},
			to(value) {
				return value?.format("DD-MM-YYYY") ?? "";
			},
		},
	}),
	helper: defineQueryModel<Nullish<RequestRequirements["helperType"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "group":
						return "group";
					case "single":
						return "single";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
	isOnline: defineQueryModel<Nullish<RequestRequirements["isOnline"]>>({
		transform: {
			from(param) {
				switch (param) {
					case "true":
						return true;
					case "false":
						return false;
					default:
						return null;
				}
			},
			to(value) {
				switch (value) {
					case true:
						return "true";
					case false:
						return "false";
					default:
						return "";
				}
			},
		},
	}),
	qualification: defineQueryModel<
		Nullish<RequestRequirements["qualification"]>
	>({
		transform: {
			from(param) {
				switch (param) {
					case "common":
						return "common";
					case "professional":
						return "professional";
					default:
						return null;
				}
			},
			to(value) {
				return value || "";
			},
		},
	}),
} satisfies QueryModel;

const SearchModel = {
	q: defineQueryModel({
		transform: {
			from: String,
			to(s) {
				return s.toLowerCase();
			},
		},
	}),
} satisfies QueryModel;

type FilterModelValue = QueryModelValue<typeof FilterModel>;
type SearchModelValue = QueryModelValue<typeof SearchModel>;
interface FullFilter extends FilterModelValue, SearchModelValue {}

type Request = Awaited<ReturnType<typeof prefetchRequests>>[number];
type RequestRequirements = NonNullable<Request["helperRequirements"]>;
type Nullish<T> = Exclude<T, undefined> | null;

function prefetchRequests(client: QueryClient) {
	const requestsOpts = $api.queryOptions(
		"get",
		"/api/request",
		{},
		{ staleTime: 60_000 },
	);
	return $api.prefetchQuery(client, requestsOpts);
}

// todo - use async API to unblock UI
// todo - abortable?
function filterRequests(
	requests: Array<Request>,
	filter: FullFilter,
): Array<Request> {
	if (isFilterEmpty(filter)) {
		return requests;
	}

	return requests.filter((request) => {
		const { helperRequirements } = request;
		if (
			!isEqualsFilter(filter.help, request.helpType) ||
			!isEqualsFilter(filter.requester, request.requesterType) ||
			!isEqualsFilter(filter.helper, helperRequirements?.helperType) ||
			!isEqualsFilter(filter.isOnline, helperRequirements?.isOnline) ||
			!isEqualsFilter(filter.qualification, helperRequirements?.qualification)
		) {
			return false;
		}

		if (
			filter.until !== null &&
			dayjs(request.endingDate, "YYYY-MM-DD").unix() > filter.until.unix()
		) {
			return false;
		}

		if (filter.q !== null) {
			if (
				!request.title?.toLowerCase().includes(filter.q) ||
				!request.organization?.title?.toLowerCase().includes(filter.q)
			) {
				return false;
			}
		}

		return true;
	});
}

function isEqualsFilter<T>(filter: Nullish<T>, value: NoInfer<T>): boolean {
	return filter === null || filter === value;
}

function isFilterEmpty(filter: Partial<FullFilter>) {
	return (
		filter.help == null &&
		filter.helper == null &&
		filter.isOnline == null &&
		(filter.q === "" || filter.q === undefined) &&
		filter.qualification == null &&
		filter.requester == null &&
		filter.until == null
	);
}

function useFilterModel() {
	const [filter, setFilter] = useQueryModel({
		...FilterModel,
		...ReuseRequestModel,
	});

	function canReuseRequest<K extends keyof FilterModelValue>(
		key: K,
		newValue: FilterModelValue[K],
		prevValue: FilterModelValue[K],
	): boolean {
		if (newValue == null) {
			return false;
		}

		if (prevValue == null && newValue !== null) {
			return true;
		}

		switch (key) {
			case "help":
			case "helper":
			case "isOnline":
			case "qualification":
			case "requester":
				return newValue === prevValue;
			case "until":
				return newValue <= prevValue;
			default:
				return false;
		}
	}

	function setValue<K extends keyof FilterModelValue>(
		key: K,
		value: FilterModelValue[K],
	) {
		setFilter((filter) => {
			return {
				...filter,
				[key]: value,
				"~reuseRequest": canReuseRequest(key, value, filter[key]),
			};
		});
	}

	return {
		filter,
		reset() {
			setFilter({
				help: null,
				requester: null,
				helper: null,
				isOnline: null,
				qualification: null,
				until: null,
				"~reuseRequest": false,
			});
		},
		setValue,
		createCheckboxHandler<K extends keyof FilterModelValue>(
			key: K,
			value: FilterModelValue[K],
		): CheckboxProps {
			return {
				checked: filter[key] === value,
				onChange(e) {
					setValue(key, e.currentTarget.checked ? value : null);
				},
			};
		},
	};
}

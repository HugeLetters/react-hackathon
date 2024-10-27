import { $api } from "@lib/api/client";
import { ErrorScreen } from "@lib/components/Error";
import { defineLoader } from "@lib/router/loader";
import {
	type QueryModel,
	defineQueryModel,
	useQueryModel,
	useQueryState,
} from "@lib/state/query";
import { Search as SearchIcon } from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid2,
	Paper,
	TextField,
	Typography,
	type CheckboxProps,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { QueryClient } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import type { PropsWithChildren } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

export const { loader, useLoaderData } = defineLoader(
	async ({ queryClient }) => {
		const requests = await prefetchRequests(queryClient);
		return { requests: filterRequests(requests) };
	},
);

export function Component() {
	const data = useLoaderData();
	const context: RequestSearchContext = { data };

	return (
		<Layout>
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
	const [search, setSearch] = useQueryState("q", {
		transform: { from: String, to: String },
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
				value={search}
				onChange={(e) => setSearch(e.currentTarget.value)}
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

			<DatePicker
				disablePast
				views={["year", "month", "day"]}
				value={filter.until}
				onChange={(value) => {
					setValue("until", value);
				}}
			/>

			<Button onClick={reset}>Сбросить</Button>
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

function filterRequests(requests: Array<Request>): Array<Request> {
	return requests;

function useFilterModel() {
	const [filter, setFilter] = useQueryModel(FilterModel);

	function setValue<K extends keyof typeof filter>(
		key: K,
		value: (typeof filter)[K],
	) {
		setFilter((filter) => ({ ...filter, [key]: value }));
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
			});
		},
		setValue,
		createCheckboxHandler<K extends keyof typeof filter>(
			key: K,
			value: (typeof filter)[K],
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

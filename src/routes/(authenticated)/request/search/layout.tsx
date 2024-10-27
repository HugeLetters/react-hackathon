import { useQueryModel } from "@lib/state/query";
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
import { Outlet } from "react-router-dom";
import {
	FilterModel,
	type FilterModelValue,
	ReuseRequestModel,
	SearchModel,
	isFilterEmpty,
} from "./layout.shared";

export function Component() {
	return (
		<Box height="100%" paddingBlock="1rem">
			<Grid2 container size={12} height="100%">
				<Grid2 size={3}>
					<Typography variant="h4">Запросы о помощи</Typography>
					<Filters />
				</Grid2>
				<Grid2 size={9} height="100%">
					<Search />
					<Box height="100%">
						<Outlet />
					</Box>
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

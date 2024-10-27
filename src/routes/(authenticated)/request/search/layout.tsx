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
	PageModel,
	ReuseRequestModel,
	SearchModel,
	isFilterEmpty,
} from "./layout.shared";

export function Component() {
	return (
		<Box height="100%" maxWidth='1500px' sx={{padding:"0", boxSizing:"border-box" }}>
			<Typography variant="h4" sx={{marginBottom:"20px"}}>Запросы о помощи</Typography>
			<Grid2 container size={12} height="100%">
				<Grid2 size={3}>
					<Filters />
				</Grid2>
				<Grid2 size={9} height="100%" maxWidth="1080px" width="100%">
					<Search />
					<Box>
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
		...PageModel,
	});

	return (
		<Paper
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				padding: "2rem",
				marginBottom:"20px"
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
							page: 1,
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
		<Paper sx={{padding:'20px', maxWidth:'320px', width:'100%', marginRight:"20px"}}>
			<Typography variant='h6' sx={{marginBottom:'25px'}}>Фильтрация</Typography>
			<FormGroup>
				<FormLabel>Кому мы помогаем</FormLabel>
				<FormControlLabel  sx={{paddingLeft:'12px'}}
					control={
						<Checkbox {...createCheckboxHandler("requester", "person")} />
					}
					label="Пенсионеры"
				/>
				<FormControlLabel  sx={{paddingLeft:'12px'}}
					control={
						<Checkbox {...createCheckboxHandler("requester", "organization")} />
					}
					label="Дома престарелых"
				/>
			</FormGroup>
			<FormGroup>
				<FormLabel>Чем мы помогаем</FormLabel>
				<FormControlLabel  sx={{paddingLeft:'12px'}}
					control={<Checkbox {...createCheckboxHandler("help", "material")} />}
					label="Вещи"
				/>
				<FormControlLabel  sx={{paddingLeft:'12px'}}
					control={<Checkbox {...createCheckboxHandler("help", "finance")} />}
					label="Финансирование"
				/>
			</FormGroup>

			<RequirementFilters />

			<FormControlLabel sx={{width:'100%', margin:"0", alignItems:"flex-start", marginTop:"20px"}}
				control={
					<DatePicker
						sx={{width:"100%"}}
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

			<Button disabled={isFilterEmpty(filter)} onClick={reset} variant="outlined" size="large" sx={{width:'100%', marginTop:"40px"}} color="text">
				Сбросить
			</Button>
		</Paper>
	);
}

function RequirementFilters() {
	const { createCheckboxHandler } = useFilterModel();
	return (
		<Accordion >
			<AccordionSummary  sx={{paddingLeft:'42px'}}>Волонтерство</AccordionSummary>
			<Paper sx={{backgroundColor: "#F5F5F5", border:'none'}}>
			<AccordionDetails sx={{paddingLeft:'42px'}}>
				<FormGroup>
					<FormLabel>Специализация</FormLabel>
					<FormControlLabel sx={{paddingLeft:'10px'}}
						control={
							<Checkbox
								{...createCheckboxHandler("qualification", "professional")}
							/>
						}
						label="Квалифицированная"
					/>
					<FormControlLabel  sx={{paddingLeft:'10px'}}
						control={
							<Checkbox {...createCheckboxHandler("qualification", "common")} />
						}
						label="Не требует профессии"
					/>
				</FormGroup>
				<FormGroup>
					<FormLabel>Формат</FormLabel>
					<FormControlLabel  sx={{paddingLeft:'10px'}}
						control={<Checkbox {...createCheckboxHandler("isOnline", true)} />}
						label="Онлайн"
					/>
					<FormControlLabel  sx={{paddingLeft:'10px'}}
						control={<Checkbox {...createCheckboxHandler("isOnline", false)} />}
						label="Офлайн"
					/>
				</FormGroup>
				<FormGroup>
					<FormLabel>Необходимо волонтеров</FormLabel>
					<FormControlLabel  sx={{paddingLeft:'10px'}}
						control={<Checkbox {...createCheckboxHandler("helper", "group")} />}
						label="Группа"
					/>
					<FormControlLabel  sx={{paddingLeft:'10px'}}
						control={
							<Checkbox {...createCheckboxHandler("helper", "single")} />
						}
						label="Один"
					/>
				</FormGroup>
			</AccordionDetails>
			</Paper>
		</Accordion>
	);
}

function useFilterModel() {
	const [filter, setFilter] = useQueryModel({
		...FilterModel,
		...ReuseRequestModel,
		...PageModel,
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
				page: 1,
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
				page: 1,
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

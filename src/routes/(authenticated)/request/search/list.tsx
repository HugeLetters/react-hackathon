import star from "@assets/icons/Star.svg";
import {
	Box,
	Button,
	List,
	ListItem,
	Slider,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import { useRequestSearchContext } from "./layout.loader";

const LocalSlider = styled(Slider)({
	padding: "4px 0",
	"& .MuiSlider-thumb": {
		height: 4,
		width: 4,
		"&::before": {
			display: "none",
		},
	},
	"& .MuiSlider-valueLabel": {
		lineHeight: 4,
	},
});

export function Component() {
	const ctx = useRequestSearchContext();

	return (
		<List sx={{ width: "100%", maxWidth: "1008px", padding: "0" }}>
			{ctx.data.page.map((request) => (
				<ListItem
					key={request.id}
					sx={{
						maxWidth: "1008px",
						width: "100%",
						borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
						alignItems: "start",
						paddingTop: "20px",
						paddingBottom: "30px",
						paddingLeft: "52px",
						boxSizing: "border-box",
						display: "grid",
						grid: " auto auto / 25% 24% 24%",
						gap: "30px",
						position: "relative",
					}}
				>
					<Typography variant="h5" fontSize="regular">
						{request.title}
					</Typography>
					<Stack>
						<Typography variant="subtitle2">Организатор</Typography>
						<Typography variant="body2">
							{request.organization?.title}
						</Typography>
					</Stack>
					<Stack>
						<Typography variant="subtitle2">Локация</Typography>
						<Typography variant="body2">
							Область: {request.location?.district}
						</Typography>
						<Typography variant="body2">
							Населенный пункт: {request.location?.city}
						</Typography>
					</Stack>
					<Box>
						<Typography variant="subtitle2">Мы собрали</Typography>
						{request.requestGoal !== 0 ? (
							<Box sx={{ display: "flex", flexDirection: "column" }}>
								<LocalSlider
									min={0}
									max={request.requestGoal}
									value={request.requestGoalCurrentValue}
								/>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										top: "0",
										height: "20px",
									}}
								>
									<Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
										{request.requestGoalCurrentValue} руб
									</Typography>
									<Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
										{request.requestGoal} руб
									</Typography>
								</Box>
								<Typography
									variant="body2"
									color="rgba(0, 0, 0, 0.6)"
									sx={{ margin: "20px 0 10px" }}
								>
									Нас уже: {request.contributorsCount}
								</Typography>
								<Button variant="contained" sx={{ width: "100%" }}>
									Помочь
								</Button>
							</Box>
						) : (
							<Typography variant="body2">Сумма еще не объявлена</Typography>
						)}
					</Box>
					<Stack>
						<Typography variant="subtitle2">Завершение</Typography>
						{request.endingDate && (
							<Typography variant="body2">
								{formatDate(request.endingDate)}
							</Typography>
						)}
					</Stack>
					<Stack>
						<Typography variant="subtitle2">Цель сбора</Typography>
						<Typography variant="body2">{request.goalDescription}</Typography>
					</Stack>
					<Button
						variant="outlined"
						startIcon={<img src={star} alt="" />}
						sx={{
							position: "absolute",
							right: "0",
							top: "20px",
							color: "rgba(0, 0, 0, 0.87)",
							borderColor: "rgba(0, 0, 0, 0.12)",
							textTransform: "none",
							fontWeight: "regular",
							padding: "4px 10px",
						}}
					>
						В избранное
					</Button>
				</ListItem>
			))}
		</List>
	);
}

const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);

	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const year = date.getUTCFullYear();

	return `${day}.${month}.${year}`;
};

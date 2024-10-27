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
import star from '@assets/icons/Star.svg';
import { useRequestSearchContext } from "./layout";

export function Component() {
	const ctx = useRequestSearchContext();

	const el = ctx.data.requests[0];
	console.log(el);

	const formatDate = (dateStr: string): string => {
		const date = new Date(dateStr);

		const day = String(date.getUTCDate()).padStart(2, "0");
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const year = date.getUTCFullYear();

		return `${day}.${month}.${year}`;
	};

	const LocalSlider = styled(Slider) ({
		padding: '4px 0',
		'& .MuiSlider-thumb': {
			height: 4,
			width: 4,
			'&::before': {
				display: 'none',
			},
		},
		'& .MuiSlider-valueLabel': {
			lineHeight: 4,
		},
	})

	return (
		<List sx={{width:'100%', maxWidth:'1008px', padding:'0'}}>
			<ListItem sx={{ maxWidth:'1008px', width:'100%', borderBottom: "1px solid rgba(0, 0, 0, 0.12)",alignItems:'start', paddingTop:'20px',paddingBottom:'30px',paddingLeft:'52px', boxSizing:'border-box', display:'grid', grid:' auto auto / 25% 24% 24%', gap:'30px', position: 'relative' }}>

				<Typography variant="h5" fontSize="regular">
					{el?.title}
				</Typography>
				<Stack>
					<Typography variant="subtitle2">Организатор</Typography>
					<Typography variant="body2">{el?.organization?.title}</Typography>
				</Stack>
				<Stack>
					<Typography variant="subtitle2">Локация</Typography>
					<Typography variant="body2">
						Область: {el?.location?.district}
					</Typography>
					<Typography variant="body2">
						Населенный пункт: {el?.location?.city}
					</Typography>
				</Stack>
				<Box>
					<Typography variant="subtitle2">Мы собрали</Typography>
					{el && el.requestGoal !== 0 ? (
						<Box sx={{display:'flex', flexDirection:'column'}}>
							<LocalSlider
								min={0}
								max={el?.requestGoal}
								value={el?.requestGoalCurrentValue}
							/>
							<Box sx={{ display: "flex", justifyContent: "space-between" , top:'0', height:'20px'}}>
								<Typography variant="body2" color="rgba(0, 0, 0, 0.6)">{el.requestGoalCurrentValue} руб</Typography>
								<Typography variant="body2" color="rgba(0, 0, 0, 0.6)">{el.requestGoal} руб</Typography>
							</Box>
							<Typography variant="body2" color="rgba(0, 0, 0, 0.6)" sx={{margin:'20px 0 10px'}}>Нас уже: {el.contributorsCount}</Typography>
							<Button variant="contained" sx={{width:'100%'}}>Помочь</Button>
						</Box>
					) : (
						<Typography variant="body2">Сумма еще не объявлена</Typography>
					)}
				</Box>
				<Stack>
					<Typography variant="subtitle2">Завершение</Typography>
					{el?.endingDate && (
						<Typography variant="body2">
							{formatDate(el?.endingDate)}
						</Typography>
					)}
				</Stack>
				<Stack>
					<Typography variant="subtitle2">Цель сбора</Typography>
					<Typography variant="body2">{el?.goalDescription}</Typography>
				</Stack>
				<Button variant="outlined" startIcon={<img src={star} alt="" />} sx={{position:'absolute', right:'0', top:'20px', color:"rgba(0, 0, 0, 0.87)", borderColor:"rgba(0, 0, 0, 0.12)", textTransform:'none', fontWeight:'regular', padding:'4px 10px'}}>В избранное</Button>
			</ListItem>
		</List>
	);
}

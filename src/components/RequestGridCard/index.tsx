import personFinanceLogo from "@assets/icons/Dementia.svg";
import organizationLogo from "@assets/icons/NursingHome.svg";
import personMaterialLogo from "@assets/icons/Dementia.svg";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FavStarBtn } from "./FavStarBtn";
import LinearProgress from "@mui/material/LinearProgress";

import style from "./RequestGridCard.module.css";
import dayjs from "dayjs";
import { useContributeToRequest } from "./api";

export function RequestGridCard({ ...props }) {
	const { data: req } = props;
	const {
		contributeToRequest
	}= useContributeToRequest()

	const helpHandler = async (id: string) => {
		const res = await contributeToRequest(id)
		console.log('res', res)
	};

	return (
		<Paper className={style.card} variant="outlined">
			<Box display="flex" justifyContent="center">
				<Box
					component="img"
					src={
						req?.requesterType === "organization"
							? organizationLogo
							: req?.helpType === "finance"
								? personFinanceLogo
								: personMaterialLogo
					}
					alt="helpType-logo"
					height={220}
					width={220}
				/>
			</Box>
			<Box height="100%">
				<Box className={style.header}>
					<Box>{req?.title}</Box>
					<FavStarBtn isFavorite={req?.requestGoal % 2 === 0} />
				</Box>

				<Box className={style.cardContent}>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Организация</Typography>
						<Typography className={style.info}>
							{req?.organization?.title}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Локация</Typography>
						<Typography className={style.info}>
							Область: {req?.location.district}
						</Typography>
						<Typography className={style.info}>
							Населеный пункт: {req?.location.city}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Цель сбора</Typography>
						<Typography className={style.infoGoal}>
							{req?.goalDescription}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Завершение</Typography>
						<Typography className={style.infoGoal}>
							{dayjs(req?.endingDate).format("DD.MM.YYYY")}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Мы собрали</Typography>
						<LinearProgress
							className={style.progress}
							variant="determinate"
							value={(req?.requestGoalCurrentValue / req?.requestGoal) * 100}
						/>
						<Box className={style.values}>
							<Typography variant="body2">
								{req?.requestGoalCurrentValue.toLocaleString("ru-RU")} руб
							</Typography>
							<Typography variant="body2">
								{req?.requestGoal.toLocaleString("ru-RU")} руб
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box className={style.action}>
					<Typography variant="body2">
						Нас уже: {req?.contributorsCount.toLocaleString("ru-RU")}
					</Typography>
					<Button variant="contained" 
					onClick={() => helpHandler(req?.id)}
					>
						Помочь
					</Button>
				</Box>
			</Box>
		</Paper>
	);
}

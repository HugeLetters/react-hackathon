import personFinanceLogo from "@assets/icons/Dementia.svg";
import personMaterialLogo from "@assets/icons/Dementia.svg";
import organizationLogo from "@assets/icons/NursingHome.svg";
import { Box, Button, Paper, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { FavStarBtn } from "./FavStarBtn";

import type { HelpRequest } from "@lib/api/request";
import dayjs from "dayjs";
import { useContributeToRequest } from "./api";
import style from "./RequestGridCard.module.css";

type RequestGridCardProps = {
	request: HelpRequest;
};

export function RequestGridCard({ request }: RequestGridCardProps) {
	const { contributeToRequest } = useContributeToRequest();

	return (
		<Paper className={style.card} variant="outlined">
			<Box display="flex" justifyContent="center">
				<Box
					component="img"
					src={
						request.requesterType === "organization"
							? organizationLogo
							: request.helpType === "finance"
								? personFinanceLogo
								: personMaterialLogo
					}
					alt="helpType-logo"
					height={220}
					width={220}
				/>
			</Box>
			<Box className={style.container}>
				<Box className={style.header}>
					<Box>{request.title}</Box>
					<FavStarBtn isFavorite={(request.requestGoal ?? 0) % 2 === 0} />
				</Box>
				<Box className={style.cardContent}>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Организация</Typography>
						<Typography className={style.info}>
							{request.organization?.title}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Локация</Typography>
						<Typography className={style.info}>
							Область: {request.location?.district}
						</Typography>
						<Typography className={style.info}>
							Населеный пункт: {request.location?.city}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Цель сбора</Typography>
						<Typography className={style.infoGoal}>
							{request.goalDescription}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Завершение</Typography>
						<Typography className={style.infoGoal}>
							{dayjs(request.endingDate).format("DD.MM.YYYY")}
						</Typography>
					</Box>
					<Box className={style.cardInfo}>
						<Typography className={style.infoLabel}>Мы собрали</Typography>
						<LinearProgress
							className={style.progress}
							variant="determinate"
							value={
								(request.requestGoalCurrentValue ??
									0 / (request.requestGoal ?? 1)) * 100
							}
						/>
						<Box className={style.values}>
							<Typography variant="body2">
								{request.requestGoalCurrentValue?.toLocaleString("ru-RU")} руб
							</Typography>
							<Typography variant="body2">
								{request.requestGoal?.toLocaleString("ru-RU")} руб
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box className={style.action}>
					<Typography variant="body2">
						Нас уже: {request.contributorsCount?.toLocaleString("ru-RU")}
					</Typography>
					<Button
						variant="contained"
						onClick={() => contributeToRequest(request?.id ?? "")}
					>
						Помочь
					</Button>
				</Box>
			</Box>
		</Paper>
	);
}

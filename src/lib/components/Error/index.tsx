import { Box, Container, Grid2, Typography } from "@mui/material";
import style from "./error.module.css";
import ErrorImg from "./error.png";

type ErrorScreenProps = {
	message?: string;
};
export function ErrorScreen({
	message = "Ошибка! Не удалось загрузить информацию",
}: ErrorScreenProps) {
	return (
		<Container maxWidth="lg" sx={{ height: "100%" }}>
			<Grid2
				display="grid"
				alignItems="center"
				justifyContent="center"
				height="100%"
			>
				<Box>
					<Container maxWidth="xs">
						<img src={ErrorImg} alt="" className={style.img} />
					</Container>
					<Typography color="error" textAlign="center" variant="h5">
						{message}
					</Typography>
				</Box>
			</Grid2>
		</Container>
	);
}

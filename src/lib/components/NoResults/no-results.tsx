import { Box, Container, Grid2, Typography } from "@mui/material";
import NotFoundImg from "./not-found-result.png";
import style from "./not-found.module.css";

type NoResultsScreenProps = {
	message: string;
};
export function NoResultsScreen({ message }: NoResultsScreenProps) {
	return (
		<Container maxWidth="lg" sx={{ height: "100%" }}>
			<Grid2
				display="grid"
				alignItems="center"
				justifyContent="center"
				height="100%"
			>
				<Box>
					<Container sx={{ maxWidth: "17rem" }}>
						<img src={NotFoundImg} alt="" className={style.img} />
					</Container>
					<Typography color="info" textAlign="center" variant="h5">
						{message}
					</Typography>
				</Box>
			</Grid2>
		</Container>
	);
}

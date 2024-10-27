import { Button } from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export function FavStarBtn({ ...props }) {
	const { isFavorite } = props;
	return (
		<Button
			sx={{
				height: "32px",
				minWidth: "32px",
				padding: 0,
				color: "rgba(0, 0, 0, 0.56)",
				borderColor: "rgba(0, 0, 0, 0.12)",
			}}
			aria-label="favorite"
			variant="outlined"
		>
			{!isFavorite ? (
				<StarIcon fontSize="small" />
			) : (
				<StarBorderIcon fontSize="small" />
			)}
		</Button>
	);
}

import profileLogo from "@assets/icons/Icon-profile-header.svg";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

export function HeaderBtn() {
	const location = useLocation();
	const isAuthPage = location.pathname === "/auth/signin";

	if (isAuthPage) {
		return (
			<Button
				variant="outlined"
				endIcon={<ArrowForwardIosIcon fontSize="small" />}
			>
				Войти
			</Button>
		);
	}

	return (
		<Button
			variant="contained"
			color="primary"
			sx={{ background: "none" }}
			disableElevation
		>
			<Box component="img" src={profileLogo} alt="Иконка" />
		</Button>
	);
}

import profileLogo from "@assets/icons/Icon-profile-header.svg";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

export function HeaderBtn() {
	const location = useLocation();

	if (location.pathname === "/auth/signin") {
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
		<Button>
			<Box component="img" src={profileLogo} alt="Иконка" />
		</Button>
	);
}

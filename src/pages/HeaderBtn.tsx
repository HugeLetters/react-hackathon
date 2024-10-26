import { Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
// import authHeaderBtn from "@assets/icons/Vector-header-ayth.svg";
import profileLogo from "@assets/icons/Icon-profile-header.svg";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export function HeaderBtn() {

  const location = useLocation();

	if (location.pathname === '/auth/signin' ) {
    return (
			<Button variant="outlined"  endIcon={<ArrowForwardIosIcon fontSize="small" />}>
				Войти
				{/* <Box component="img" src={authHeaderBtn} alt="Стрелка" /> */}
			</Button>
		)
	}

	else {
		return (
			<Button>
				<Box component="img" src={profileLogo} alt="Иконка" />
			</Button>
		)
	}
}

import logo from "@assets/icons/Logo.svg";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { HeaderBtn } from "./HeaderBtn";

export function Header() {
	return (
		<AppBar component="header" color="inherit" sx={{ position: "unset" }}>
			<Toolbar
				sx={{
					maxWidth: "1500px",
					width: "100%",
					margin: "0 auto",
					height: "84px",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<Box component="img" src={logo} alt="" />
				<Typography component="p">Запросы о помощи</Typography>
				<HeaderBtn />
			</Toolbar>
		</AppBar>
	);
}

import logo from "@assets/icons/Logo.svg";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import style from "./Header.module.css";
import { HeaderBtn } from "./HeaderBtn";

export function Header() {
	return (
		<header>
			<AppBar position="sticky" color="inherit">
				<Toolbar className={style.toolbar}>
					<Box component="img" src={logo} alt="" />
					<Typography component="p">Запросы о помощи</Typography>
					<HeaderBtn />
				</Toolbar>
			</AppBar>
		</header>
	);
}

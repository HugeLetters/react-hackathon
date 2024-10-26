import logo from "@assets/icons/Logo.svg";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { HeaderBtn } from "./HeaderBtn";
import style from "./Header.module.css";

export function Header() {
	return (
		<header>
			<AppBar position="sticky" color="inherit">
				<Toolbar className={style.toolbar}>
					<Box component="img" src={logo} alt="Логотип" />
					<Typography component="p">Запросы о помощи</Typography>
					<HeaderBtn />
				</Toolbar>
			</AppBar>
		</header>
	);
}

import { Paper, Toolbar, Typography } from "@mui/material";

const footerStyle = {
	bottom: "0",
	height: "152px",
	width: "100%",
	display: "flex",
	alignItems: "center",
};

const toolbarStyle = {
	width: "1500px",
	margin: "0 auto",
	display: "flex",
	justifyContent: "space-between",
};

export function Footer() {
	return (
		<footer>
			<Paper style={footerStyle} sx={{ position: "sticky" }} variant="outlined">
				<Toolbar style={toolbarStyle}>
					<Typography component="p">Об ивенте</Typography>
					<Typography component="p">Github проекта</Typography>
					<Typography component="p">Чат для джунов</Typography>
				</Toolbar>
			</Paper>
		</footer>
	);
}

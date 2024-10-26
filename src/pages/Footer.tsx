import { Paper, Toolbar, Typography } from "@mui/material";

export function Footer() {
	return (
		<footer>
			<Paper
				sx={{
					height: "152px",
					width: "100%",
					display: "flex",
					alignItems: "center",
				}}
				variant="outlined"
			>
				<Toolbar
					sx={{
						maxWidth: "1500px",
						width: "100%",
						margin: "0 auto",
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Typography component="p">Об ивенте</Typography>
					<Typography component="p">Github проекта</Typography>
					<Typography component="p">Чат для джунов</Typography>
				</Toolbar>
			</Paper>
		</footer>
	);
}

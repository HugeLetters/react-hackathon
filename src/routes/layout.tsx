import { Container, Paper, Stack } from "@mui/material";
import { Footer } from "@pages/Footer";
import { Header } from "@pages/Header";
import { Outlet } from "react-router-dom";

export function Component() {
	return (
		<Stack height="calc(100dvh + 236px)">
			<Header />
			<Paper
				variant="outlined"
				component="main"
				sx={{
					backgroundColor: "#F5F5F5",
					padding: "2rem",
					height: "100%",
				}}
			>
				<Container maxWidth="xl" sx={{ height: "100%" }}>
					<Outlet />
				</Container>
			</Paper>
			<Footer />
		</Stack>
	);
}

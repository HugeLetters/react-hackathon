import { Container, Stack } from "@mui/material";
import { Footer } from "@pages/Footer";
import { Header } from "@pages/Header";
import { Outlet } from "react-router-dom";

export function Component() {
	return (
		<Stack height="100dvh">
			<Header />
			<Container component="main" sx={{ height: "100%" }}>
				<Outlet />
			</Container>
			<Footer />
		</Stack>
	);
}

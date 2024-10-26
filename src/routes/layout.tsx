import { Footer } from "@pages/Footer";
import { Header } from "@pages/Header";
import { Outlet } from "react-router-dom";

export function Component() {
	return (
		<div>
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

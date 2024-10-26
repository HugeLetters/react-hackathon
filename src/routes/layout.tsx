import { Outlet } from "react-router-dom";

export function Component() {
	return (
		<div>
			<header>header</header>
			<main>
				<Outlet />
			</main>
			<footer>footer</footer>
		</div>
	);
}

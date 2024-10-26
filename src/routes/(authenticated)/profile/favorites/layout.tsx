import { Outlet } from "react-router-dom";

export function Component() {
	return (
		<div>
			<div>favorites</div>
			<Outlet />
		</div>
	);
}

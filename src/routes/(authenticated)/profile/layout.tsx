import { Outlet } from "react-router-dom";

export function Component() {
	return (
		<div>
			<div>profile</div>
			<Outlet />
		</div>
	);
}

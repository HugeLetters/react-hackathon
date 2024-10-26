import { Outlet } from "react-router-dom";

export function Component() {
	return (
		<div>
			<div>request search</div>
			<Outlet />
		</div>
	);
}

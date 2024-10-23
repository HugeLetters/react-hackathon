import { defineLoader } from "@lib/router/loader";
import { Link, Outlet } from "react-router-dom";
import style from "./layout.module.css";

const { loader, useLoaderData } = defineLoader(async () => {
	return { data: "layout data" };
});

export { loader };

export function Component() {
	const data = useLoaderData();

	return (
		<div>
			<div>Layout - {data.data}</div>
			<nav className={style.nav}>
				<Link to="/a">a</Link>
				<Link to={{ pathname: "/b" }}>b</Link>
				<Link to={{ pathname: "/12345" }}>param</Link>
			</nav>
			<Outlet />
		</div>
	);
}

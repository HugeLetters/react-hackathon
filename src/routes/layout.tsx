import { defineLoader } from "@lib/router/loader";
import { Link as MUILink } from "@mui/material";
import type { ComponentPropsWithRef } from "react";
import { Outlet, Link as RRLink } from "react-router-dom";
import style from "./layout.module.css";

const { loader, useLoaderData } = defineLoader(async () => {
	return await Promise.resolve({ data: "layout data" });
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

function Link(props: ComponentPropsWithRef<typeof RRLink>) {
	return <MUILink component={RRLink} underline="hover" {...props} />;
}

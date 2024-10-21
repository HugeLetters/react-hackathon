import * as RootLayout from "@routes/layout";
import { Navigate, createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
		path: "/",
		loader: RootLayout.loader,
		Component: RootLayout.Component,
		children: [
			{
				index: true,
				element: <Navigate to="/a" />,
			},
			{
				path: "/a",
				lazy: () => import("@routes/a"),
			},
			{
				path: "/b",
				lazy: () => import("@routes/b"),
			},
			{
				path: "/:param",
				lazy: () => import("@routes/:param"),
			},
		],
	},
]);

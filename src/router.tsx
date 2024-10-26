import * as RootLayout from "@routes/layout";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: RootLayout.Component,
		children: [
			{
				path: "auth",
				children: [
					{
						path: "signin",
						lazy: () => import("@routes/auth/signin"),
					},
				],
			},
		],
	},
]);

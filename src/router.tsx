import * as RootLayout from "@routes/layout";
import * as Page404 from "@routes/404";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
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
			{
				path: "*",
				Component: Page404.Component,
			},
		],
	},
]);

import * as RootLayout from "@routes/layout";
import * as Page404 from "@routes/404";
import * as AuthenticatedLayout from "@routes/(authenticated)/layout";
import { createBrowserRouter, Navigate } from "react-router-dom";

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
				loader: AuthenticatedLayout.loader,
				children: [
					{
						path: "profile",
						lazy: () => import("@routes/(authenticated)/profile/layout"),
						children: [
							{
								index: true,
								element: <Navigate to="/profile/data" />,
							},
							{
								path: "data",
								lazy: () => import("@routes/(authenticated)/profile/data"),
							},
							{
								path: "contacts",
								lazy: () => import("@routes/(authenticated)/profile/contacts"),
							},
							{
								path: "favorites",
								lazy: () => import("@routes/(authenticated)/profile/favorites"),
							},
						],
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

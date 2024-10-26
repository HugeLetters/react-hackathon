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
								lazy: () =>
									import("@routes/(authenticated)/profile/favorites/layout"),
								children: [
									{
										index: true,
										element: <Navigate to="/profile/favorites/list" />,
									},
									{
										path: "list",
										lazy: () =>
											import("@routes/(authenticated)/profile/favorites/list"),
									},
									{
										path: "grid",
										lazy: () =>
											import("@routes/(authenticated)/profile/favorites/grid"),
									},
									{
										path: "map",
										lazy: () =>
											import("@routes/(authenticated)/profile/favorites/map"),
									},
								],
							},
						],
					},
					{
						path: "request",
						children: [
							{
								index: true,
								element: <Navigate to="/request/search/list" />,
							},
							{
								path: "search",
								lazy: () =>
									import("@routes/(authenticated)/request/search/layout"),
								children: [
									{
										index: true,
										element: <Navigate to="/request/search/list" />,
									},
									{
										path: "list",
										lazy: () =>
											import("@routes/(authenticated)/request/search/list"),
									},
									{
										path: "grid",
										lazy: () =>
											import("@routes/(authenticated)/request/search/grid"),
									},
									{
										path: "map",
										lazy: () =>
											import("@routes/(authenticated)/request/search/map"),
									},
								],
							},
							{
								path: "info/:id",
								lazy: () => import("@routes/(authenticated)/request/info/:id"),
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

import {
	augmentRouterDataLoader,
	augmentRouterLoader,
} from "@lib/router/loader";
import * as AuthenticatedLayout from "@routes/(authenticated)/layout";
import * as Page404 from "@routes/404";
import * as RootLayout from "@routes/layout";
import type { QueryClient } from "@tanstack/react-query";
import { Navigate, createBrowserRouter } from "react-router-dom";

type RouterContext = {
	queryClient: QueryClient;
};

export function createRouter(ctx: RouterContext) {
	return createBrowserRouter([
		{
			Component: RootLayout.Component,
			children: [
				{
					index: true,
					element: <Navigate to="/request/search/list" />,
				},
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
					loader: augmentRouterLoader(AuthenticatedLayout.loader, ctx),
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
									lazy: () =>
										import("@routes/(authenticated)/profile/data").then(
											augmentRouterDataLoader(ctx),
										),
								},
								{
									path: "contacts",
									lazy: () =>
										import("@routes/(authenticated)/profile/contacts"),
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
												import(
													"@routes/(authenticated)/profile/favorites/list"
												),
										},
										{
											path: "grid",
											lazy: () =>
												import(
													"@routes/(authenticated)/profile/favorites/grid"
												),
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
											lazy: () =>
												import(
													"@routes/(authenticated)/request/search/layout.loader"
												).then(augmentRouterDataLoader(ctx)),
											children: [
												{
													index: true,
													element: <Navigate to="/request/search/list" />,
												},
												{
													path: "list",
													lazy: () =>
														import(
															"@routes/(authenticated)/request/search/list"
														),
												},
												{
													path: "grid",
													lazy: () =>
														import(
															"@routes/(authenticated)/request/search/grid"
														),
												},
												{
													path: "map",
													lazy: () =>
														import(
															"@routes/(authenticated)/request/search/map"
														),
												},
											],
										},
									],
								},
								{
									path: "info/:id",
									lazy: () =>
										import("@routes/(authenticated)/request/info/:id").then(
											augmentRouterDataLoader(ctx),
										),
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
}

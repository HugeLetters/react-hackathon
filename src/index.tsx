import "@fontsource/roboto";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "react-toastify/dist/ReactToastify.css";

import "@assets/index.css";

import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { router } from "./router";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Could not find root element");
}

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

function App() {
	return (
		<StyledEngineProvider injectFirst>
			<CssBaseline />
			<ToastContainer stacked />
			<RouterProvider router={router} />
		</StyledEngineProvider>
	);
}

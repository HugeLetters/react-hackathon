import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Could not find root element");
}

createRoot(root).render(
	<StrictMode>
		<div>hello</div>
	</StrictMode>,
);

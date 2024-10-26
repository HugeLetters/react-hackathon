import { defineLoader } from "@lib/router/loader";
import { redirect } from "react-router-dom";

export const { loader } = defineLoader(() => {
	const isSignedIn = true;
	if (!isSignedIn) {
		throw redirect("/auth/signin");
	}

	return null;
});

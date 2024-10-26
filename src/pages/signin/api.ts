import { $api } from "@lib/api/client";

export function useSignIn() {
	return $api.useMutation("post", "/api/auth", {
		onSuccess(data) {
			if (data.token) {
				localStorage.setItem("auth-token", data.token);
			}

			throw new Error("Auth unsuccesfull");
		},
	});
}

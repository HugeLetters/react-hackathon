import { $api } from "@lib/api/client";
import { toast } from "react-toastify";

export function useSignIn() {
	return $api.useMutation("post", "/api/auth", {
		onSuccess(data) {
			if (!data.token) {
				throw new Error("Auth unsuccesfull");
			}

			localStorage.setItem("auth-token", data.token);
			toast.success("Авторизация прошла успешно");
		},
		onError() {
			toast.error("Ошибка! Попробуйте еще раз");
		},
	});
}

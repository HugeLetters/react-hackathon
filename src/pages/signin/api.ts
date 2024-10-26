import { $api } from "@lib/api/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useSignIn() {
	const navigate = useNavigate();
	return $api.useMutation("post", "/api/auth", {
		onSuccess(data) {
			if (!data.token) {
				throw new Error("Auth unsuccesfull");
			}

			localStorage.setItem("auth-token", data.token);
			navigate("/request/search");
		},
		onError() {
			toast.error("Ошибка! Попробуйте еще раз");
		},
	});
}

import { $api } from "@lib/api/client";
import { toast } from "react-toastify";

export function useContributeToRequest() {
	const { mutate } = $api.useMutation(
		"post",
		"/api/request/{id}/contribution",
		{
			onSuccess(data) {
				if (!data) {
					throw new Error("Donate fail");
				}
				toast.success("Спасибо! Вклад успешно внесен");
			},
			onError() {
				toast.error("Ошибка! Попробуйте еще раз");
			},
		},
	);
	const contributeToRequest = (id: string) => {
		mutate({ params: { path: { id: id } }, parseAs: "text" });
	};
	return { contributeToRequest } as const;
}

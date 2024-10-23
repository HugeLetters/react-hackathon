import { type ActionFunctionArgs, useActionData } from "react-router-dom";

type ActionData<R> = R | Promise<R>;

export function defineAction<R>(
	action: (params: ActionFunctionArgs) => ActionData<R>,
) {
	return {
		action,
		useActionData: useActionData as () => R | undefined,
	};
}

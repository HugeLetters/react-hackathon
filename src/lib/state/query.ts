import { useSearchParams } from "react-router-dom";

type QueryStateOptions<T> = {
	transform: {
		from: (param: string) => T;
		to: (value: T) => string;
	};
};
export function useQueryState<T = string>(
	key: string,
	{ transform }: QueryStateOptions<T>,
) {
	const [params, setSearchParams] = useSearchParams();
	const param = params.get(key) ?? "";
	const value = transform.from(param);

	function setValue(value: T) {
		const param = transform.to(value);
		setSearchParams(
			(params) => {
				if (!value) {
					params.delete(key);
				} else {
					params.set(key, param);
				}
				return params;
			},
			{
				replace: true,
				preventScrollReset: true,
			},
		);
	}
	return [value, setValue] as const;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type QueryModel = Record<string, QueryStateOptions<any>>;
export type QueryModelValue<M extends QueryModel> = {
	[K in keyof M]: M[K] extends QueryStateOptions<infer T> ? T : never;
};

export function useQueryModel<M extends QueryModel>(model: M) {
	const [params, setSearchParams] = useSearchParams();
	const value = parseQueryModel(params, model);

	function setValue(
		updater:
			| QueryModelValue<M>
			| ((value: QueryModelValue<M>) => QueryModelValue<M>),
	) {
		let newValue: QueryModelValue<M>;
		if (typeof updater === "function") {
			newValue = updater(value);
		} else {
			newValue = updater;
		}

		const newParams = Object.entries(newValue).map(([key, value]) => {
			const opts = model[key];
			return [key, opts?.transform.to(value)] as const;
		});

		setSearchParams(
			(params) => {
				for (const [key, value] of newParams) {
					if (!value) {
						params.delete(key);
					} else {
						params.set(key, value);
					}
				}

				return params;
			},
			{
				replace: true,
				preventScrollReset: true,
			},
		);
	}
	return [value, setValue] as const;
}

export function defineQueryModel<T>(ops: QueryStateOptions<T>) {
	return ops;
}

export function parseQueryModel<M extends QueryModel>(
	params: URLSearchParams,
	model: M,
) {
	const modelEntries = Object.entries(model);
	const parsedEntries = modelEntries.map(([key, model]) => {
		const param = params.get(key) ?? "";
		return [key, model.transform.from(param)] as const;
	});

	return Object.fromEntries(parsedEntries) as QueryModelValue<M>;
}

import { useSearchParams } from "react-router-dom";

type QueryStateOptions<T> = {
	/**
	 * Трансформация значения из и к строке-параметру
	 */
	transform: {
		/** Трансформация из строки-параметра к значению */
		from: (param: string) => T;
		/** Трансформация к строкe-параметру из значения */
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
type QueryModelValue<M extends QueryModel> = {
	[K in keyof M]: M[K] extends QueryStateOptions<infer T> ? T : never;
};

export function useQueryModel<M extends QueryModel>(model: M) {
	const [params, setSearchParams] = useSearchParams();
	const value = Object.fromEntries(
		Object.entries(model).map(([key, model]) => {
			const param = params.get(key) ?? "";
			return [key, model.transform.from(param)];
		}),
	) as QueryModelValue<M>;

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

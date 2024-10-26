import { useRequestSearchContext } from "./layout";

export function Component() {
	const ctx = useRequestSearchContext();
	console.log(ctx.data);

	return <div>grid</div>;
}

import { RequestGridCard } from "@components/RequestGridCard";
import { useRequestSearchContext } from "./layout";

export function Component() {
	const ctx = useRequestSearchContext();
	console.log(ctx.data);

	console.log("requests", ctx.data);

	const data = ctx.data[1];

	return <RequestGridCard data={data} />;
}

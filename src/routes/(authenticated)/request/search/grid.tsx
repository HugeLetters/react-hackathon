import { RequestGridCard } from "@components/RequestGridCard";
import { useRequestSearchContext } from "./layout.loader";

export function Component() {
	const ctx = useRequestSearchContext();
	console.log(ctx.data);

	console.log("requests", ctx.data.requests);

	const data = ctx.data.requests[1];

	return <RequestGridCard data={data} />;
}

import { RequestGridCard } from "@components/RequestGridCard";
import { useRequestSearchContext } from "./layout.loader";
import { Box } from "@mui/material";

export function Component() {
	const ctx = useRequestSearchContext();
	console.log(ctx.data);

	console.log("requests", ctx.data.requests);

	const data = [
		ctx.data.requests[0],
		ctx.data.requests[1],
		ctx.data.requests[2],
	];

	return (
		<Box
			sx={{
				display: "flex",
				gap: "24px",
				padding: "20px 36px",
				overflowY: "scroll",
			}}
		>
			{data.map((req) => (
				<RequestGridCard data={req} key={req?.id} />
			))}
		</Box>
	);
}

import { RequestGridCard } from "@components/RequestGridCard";
import { Box } from "@mui/material";
import { useRequestSearchContext } from "./layout.loader";

export function Component() {
	const ctx = useRequestSearchContext();

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				gap: "24px",
				padding: "20px 0px",
				overflowY: "scroll",
			}}
		>
			{ctx.data.page.map((request) => (
				<RequestGridCard request={request} key={request.id} />
			))}
		</Box>
	);
}

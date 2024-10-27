import { RequestGridCard } from "@components/RequestGridCard";
import { Grid2 } from "@mui/material";
import { useRequestSearchContext } from "./layout.loader";

export function Component() {
	const ctx = useRequestSearchContext();

	return (
		<Grid2 container>
			{ctx.data.page.map((request) => (
				<Grid2 key={request.id} size={4} height="100%">
					<RequestGridCard request={request} />
				</Grid2>
			))}
		</Grid2>
	);
}

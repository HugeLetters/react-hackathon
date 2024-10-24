import { defineAction } from "@lib/router/action";
import { defineLoader } from "@lib/router/loader";
import { Button, Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Form } from "react-router-dom";
import { toast } from "react-toastify";
import style from "./b.module.css";

const { loader, useLoaderData } = defineLoader(async () => {
	return await Promise.resolve({ b: Math.random() });
});

const { action, useActionData } = defineAction(async () => {
	const message = `hi from action - ${Date.now()}`;
	notify(message);
	return await Promise.resolve(message);
});

export function Component() {
	const data = useLoaderData();
	const actionData = useActionData();

	return (
		<Form method="POST">
			<h1>Page B</h1>
			<p>{data.b}</p>
			<p>action data - {actionData}</p>
			<QueryComponent value={data.b} />
			<Button
				type="submit"
				variant="contained"
				color="error"
				className={style.button}
			>
				Hello world
			</Button>
		</Form>
	);
}

export { loader, action };

function notify(message: string) {
	const toastId = toast.info(
		<div>
			<Container>Action triggered</Container>
			<Container>{message}</Container>
			<Button
				variant="contained"
				color="success"
				onClick={() => {
					toast.dismiss(toastId);
				}}
			>
				Close
			</Button>
		</div>,
	);
}

type QueryComponentProps = { value: number };
function QueryComponent({ value }: QueryComponentProps) {
	const query = useQuery({
		queryKey: ["value", value],
		queryFn() {
			if (Math.random() > 0.5) {
				console.log("err");
				throw new Error("i failed");
			}

			return new Promise<number>((r) => {
				setTimeout(() => {
					r(value * 2);
				}, 1000);
			});
		},
		select(data) {
			return data + 1;
		},
		retry: 0,
	});

	if (query.isError) {
		return <p>query error - {query.error.message}</p>;
	}

	if (query.isLoading) {
		return <p>query loading</p>;
	}

	return <p>query data doubled - {query.data}</p>;
}

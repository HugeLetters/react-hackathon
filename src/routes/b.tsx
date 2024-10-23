import { defineAction } from "@lib/router/action";
import { defineLoader } from "@lib/router/loader";
import { Button, Container } from "@mui/material";
import { Form } from "react-router-dom";
import { toast } from "react-toastify";
import style from "./b.module.css";

const { loader, useLoaderData } = defineLoader(async () => {
	return { b: Math.random() };
});

const { action, useActionData } = defineAction(async () => {
	const message = `hi from action - ${Date.now()}`;
	notify(message);
	return message;
});

export function Component() {
	const data = useLoaderData();
	const actionData = useActionData();

	return (
		<Form method="POST">
			<h1>Page B</h1>
			<p>{data.b}</p>
			<p>action data - {actionData}</p>
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

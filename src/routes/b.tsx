import { defineLoader } from "@loader";
import { Button } from "@mui/material";
import style from "./b.module.css";
import { Form } from "react-router-dom";

const { loader, useLoaderData } = defineLoader(async () => {
	return { b: Math.random() };
});

export { loader };

export function Component() {
	const data = useLoaderData();

	return (
		<Form>
			<h1>Page B</h1>
			<p>{data.b}</p>
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

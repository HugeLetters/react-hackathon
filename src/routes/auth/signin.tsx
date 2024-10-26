import { SigninComponent } from "@pages/signin/SigninComponent";
import { useSignIn } from "@pages/signin/api";
import { Form } from "react-router-dom";

export function Component() {
	const { mutate: signin } = useSignIn();

	return (
		<main>
			<div>signin page</div>
			<Form
				method="post"
				onSubmit={(e) => {
					e.preventDefault();

					const data = new FormData(e.currentTarget);
					const email = data.get("email")?.toString();
					const password = data.get("password")?.toString();

					signin({ body: { login: email, password } });
				}}
			>
				<input name="email" />
				<input name="password" />
				<button type="submit">login</button>
			</Form>
			<SigninComponent />
		</main>
	);
}

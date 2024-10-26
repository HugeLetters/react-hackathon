import { Button, TextField } from "@mui/material";
import { useSignIn } from "@pages/signin/api";
import { Form } from "react-router-dom";

export function FormAuth() {
	const { mutate: signin } = useSignIn();

	return (
		<Form
			method="post"
			onSubmit={(e) => {
				e.preventDefault();

				const data = new FormData(e.currentTarget);
				const email = data.get("email")?.toString();
				const password = data.get("password")?.toString();

        console.log('form',email, password )
				signin({ body: { login: email, password } });
			}}
      style={{ display: 'flex', flexDirection: 'column', width:'485px'}}
		>
      <TextField 
        name="email" 
        required
        id="outlined-required"
        label="Логин"
        placeholder="Введите e-mail"
        sx={{marginBottom:'30px'}} />
        <TextField 
        name="password" 
        required
        id="outlined-required"
        label="Пароль"
        placeholder="Введите пароль"
        sx={{marginBottom:'40px'}} />
			<Button variant="contained" size="large" type="submit">Войти</Button>
		</Form>
	);
}

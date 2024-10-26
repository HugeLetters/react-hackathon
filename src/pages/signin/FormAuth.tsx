import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	TextField,
} from "@mui/material";
import { useSignIn } from "@pages/signin/api";
import { useState } from "react";
import { Form } from "react-router-dom";

export function FormAuth() {
	const { mutate: signin } = useSignIn();
	const [errorEmail, setErrorEmail] = useState<string | null>(null);
	const [errorPassword, setErrorPassword] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	function handleClickShowPassword() {
		setShowPassword((show) => !show);
	}

	return (
		<Form
			noValidate
			method="post"
			onSubmit={(e) => {
				e.preventDefault();

				const data = new FormData(e.currentTarget);
				const email = data.get("email")?.toString().trim();
				const password = data.get("password")?.toString().trim();

				const isValid = email ? /\S+@\S+/.test(email) : false;
				setErrorEmail(isValid ? null : "Введите корректный email-адрес");
				setErrorPassword(password ? null : "Введите корректный пароль");

				if (!isValid || !password) {
					return;
				}

				signin({ body: { login: email, password } });
			}}
			style={{ display: "flex", flexDirection: "column", maxWidth: "485px" }}
		>
			<FormControl>
				<TextField
					name="email"
					required
					id="outlined-required"
					label="Логин"
					placeholder="Введите e-mail"
					sx={{ marginBottom: "30px", position: "relative" }}
					error={!!errorEmail}
					helperText={errorEmail}
				/>
			</FormControl>

			<FormControl variant="outlined">
				<TextField
					type={showPassword ? "text" : "password"}
					placeholder="Введите пароль"
					name="password"
					sx={{ marginBottom: "40px", position: "relative" }}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment
									position="end"
									aria-label={
										showPassword ? "hide the password" : "display the password"
									}
									onClick={handleClickShowPassword}
									sx={{
										background: "none",
										outline: "1px solid transparent",
										border: "1px solid transparent",
									}}
								>
									<IconButton edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						},
					}}
					label="Пароль"
					error={!!errorPassword}
					helperText={errorPassword}
				/>
			</FormControl>

			<Button variant="contained" size="large" type="submit">
				Войти
			</Button>
		</Form>
	);
}

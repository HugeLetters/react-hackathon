import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	OutlinedInput,
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

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault();
	};

	return (
		<Form
			noValidate
			method="post"
			onSubmit={(e) => {
				e.preventDefault();
				setErrorEmail(null);
				setErrorPassword(null);

				const data = new FormData(e.currentTarget);
				const email = data.get("email")?.toString();
				const password = data.get("password")?.toString().trim();

				console.log("form", email, password);

				const isValid = email ? /\S+@\S+\.\S+/.test(email) : null;
				setErrorEmail(
					!!email ? (isValid ? null : "not valid email") : "not valid email",
				);
				setErrorPassword(!!password ? null : "not valid password");

				(!!errorEmail || !!errorPassword) &&
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
				/>
				{errorEmail && (
					<FormHelperText error sx={{ position: "absolute", top: "58px" }}>
						Введите корректный email-адрес
					</FormHelperText>
				)}
			</FormControl>

			<FormControl variant="outlined">
				<InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
				<OutlinedInput
					id="outlined-adornment-password"
					type={showPassword ? "text" : "password"}
					placeholder="Введите пароль"
					name="password"
					sx={{ marginBottom: "40px", position: "relative" }}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label={
									showPassword ? "hide the password" : "display the password"
								}
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}
								onMouseUp={handleMouseUpPassword}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
					label="Password"
				/>
				{errorPassword && (
					<FormHelperText sx={{ position: "absolute", top: "58px" }} error>
						Введите корректный пароль
					</FormHelperText>
				)}
			</FormControl>

			<Button variant="contained" size="large" type="submit">
				Войти
			</Button>
		</Form>
	);
}

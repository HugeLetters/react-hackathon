import { Alert, Paper, Stack, Typography } from "@mui/material";
import { FormAuth } from "@pages/signin/FormAuth";

export function Component() {
	return (
		<Stack
			sx={{
				width: "1500px",
				margin: "0 auto",
				flexDirection: "row",
				height: "100%",
			}}
		>
			<Paper
				component="section"
				sx={{ width: "50%", height: "100%", padding: "64px 0 0 40px" }}
				variant="outlined"
			>
				<Typography variant="h4" sx={{ marginBottom: "90px" }}>
					Авторизация
				</Typography>
				<Typography variant="h5" sx={{ marginBottom: "35px" }}>
					Вход
				</Typography>
				<FormAuth />
			</Paper>

			<Paper
				component="section"
				sx={{ width: "50%", height: "100%", padding: "64px 0 0 40px" }}
				variant="outlined"
			>
				<Typography variant="h4" sx={{ marginBottom: "90px" }}>
					Тестовые профили
				</Typography>

				<Stack sx={{ gap: "30px" }}>
					<Alert
						variant="outlined"
						sx={{ width: "320px", height: "96px" }}
						severity="info"
					>
						<Typography
							fontSize="medium"
							fontWeight="bold"
							variant="h5"
							sx={{ marginBottom: "4px" }}
						>
							Первый пользователь
						</Typography>
						<Typography fontSize="regular">
							Логин: testUser21@test.com
						</Typography>
						<Typography fontSize="regular">Пароль: password21</Typography>
					</Alert>
					<Alert
						variant="outlined"
						sx={{ width: "320px", height: "96px" }}
						severity="info"
					>
						<Typography
							fontSize="medium"
							fontWeight="bold"
							variant="h5"
							sx={{ marginBottom: "4px" }}
						>
							Первый пользователь
						</Typography>
						<Typography fontSize="regular">
							Логин: testUser22@test.com
						</Typography>
						<Typography fontSize="regular">Пароль: password22</Typography>
					</Alert>
					<Alert
						variant="outlined"
						sx={{ width: "320px", height: "96px" }}
						severity="info"
					>
						<Typography
							fontSize="medium"
							fontWeight="bold"
							variant="h5"
							sx={{ marginBottom: "4px" }}
						>
							Первый пользователь
						</Typography>
						<Typography fontSize="regular">
							Логин: testUser23@test.com
						</Typography>
						<Typography fontSize="regular">Пароль: password23</Typography>
					</Alert>
				</Stack>
			</Paper>
		</Stack>
	);
}

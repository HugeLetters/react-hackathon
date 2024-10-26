import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import logo from "@assets/icons/Logo.svg";
import { HeaderBtn } from "./HeaderBtn";

const toolbarStyle = {
  width: '1500px',
  margin: '0 auto',
  height: '84px',
  display: 'flex',
  justifyContent: 'space-between'
}

export function Header() {

  return (
    <header>
      <AppBar color="inherit">
        <Toolbar style={toolbarStyle}>
        <Box component="img" src={logo} alt="Логотип" />
        <Typography component='p'>Запросы о помощи</Typography>
        <HeaderBtn />
        </Toolbar>
      </AppBar>
    </header>
  )
}

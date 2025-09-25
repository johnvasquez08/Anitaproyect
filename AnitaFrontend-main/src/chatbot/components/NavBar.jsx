import { MenuOutlined } from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NavBar = ({ drawerWidth = 280, changeSideBar, handleClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user?.token;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: 'third.main',
      }}
    >
      <Toolbar sx={{ position: 'relative' }}>
        {/* Botón lateral */}
        <IconButton
          color='inherit'
          edge='start'
          sx={{ mr: 2 }}
          onClick={changeSideBar}
        >
          <MenuOutlined />
        </IconButton>

        {/* Título centrado */}
        <Typography
          variant='h6'
          noWrap
          component='div'
          color='white'
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          ANITA
        </Typography>

        {/* Acciones a la derecha */}
        <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
          
          {!isLoggedIn ? (
            <>
            <Button
                variant="contained"
                color='white'
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
                onClick={() => navigate("/")}
              >
                <HomeIcon sx={{ color: "black", fontSize: 30 }} />
              </Button>
              <Button
                variant="contained"
                color='white'
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
                onClick={() => navigate("/auth/login")}
              >
                Iniciar sesión
              </Button>
              <Button
                variant="contained"
                color='white'
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
                onClick={() => navigate("/auth/register")}
              >
                Registrarse
              </Button>
            </>
          ) : (
            <>
              <IconButton
                variant="contained"
                onClick={() => navigate("/")}
                color='white'
              >
                <HomeIcon sx={{ color: "white", fontSize: 30 }} />
              </IconButton>
              <IconButton color='white' onClick={() => handleClick('NothingSelectedChat')}>
                <SmartToyIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton color='white' onClick={handleLogout}>
                <LogoutIcon sx={{ color: "white" }} />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

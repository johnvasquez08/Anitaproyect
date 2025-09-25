import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Guardar todos los datos en una sola clave
        localStorage.setItem("user", JSON.stringify({
          correo,
          nombre: data.nombre,
          token: data.token,
          sender_id: data.sender_id
        }));
  
        navigate("/chat");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de red");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Entrar
          </Button>
        </form>
        <Button onClick={() => navigate("/auth/register")} fullWidth sx={{ mt: 2 }}>
          ¿No tienes cuenta? Regístrate
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;

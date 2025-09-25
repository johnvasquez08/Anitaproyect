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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const correoGuardado = localStorage.getItem("correo");
    if (correoGuardado) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password, nombre })
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
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      setError("Error de red");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Registrarse
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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
            Registrarse
          </Button>
        </form>
        <Button onClick={() => navigate("/auth/login")} fullWidth sx={{ mt: 2 }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;

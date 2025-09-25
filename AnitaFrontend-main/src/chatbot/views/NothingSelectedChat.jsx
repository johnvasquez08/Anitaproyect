import { QuestionMark } from '@mui/icons-material';
import { Chip, Grid2, Typography } from '@mui/material';

export const NothingSelectedChat = ({ handleClick }) => {
  // Obtener el nombre completo del usuario desde el localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const fullName = user?.nombre;

  // Si el nombre completo existe, extraemos el primer nombre y lo convertimos a mayúsculas
  const userName = fullName ? fullName.split(" ")[0].toUpperCase() : null;

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: 'calc(100vh - 15px)',
        backgroundColor: 'white.main',
        textAlign: 'center', // Centrar el texto también si es necesario
      }}
    >
      <Grid2>
        <img 
          src="/images/primerlogoanita.jpeg"
          alt="Anita" 
          style={{
            width: '350px',  
            height: '400px',  
          }} 
        />
        <Typography color="third" pb="10px" sx={{
          fontSize: { xs: '1.5rem', sm: '2.1rem', md: '2.5rem', lg: '2.8rem' }
        }}>
          {userName ? `¡Hola, ${userName}! Soy Anita, ¿En qué puedo ayudarte?` : '¿Con qué puedo ayudarte?'}
        </Typography>
      </Grid2>


      <Grid2 item xs={1} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: { xs: '100%', sm: '90%', md: '90%', lg: '55%' }
      }}>
        <Chip
          icon={<QuestionMark color='third' />}
          label="Respuestas a las preguntas frecuentes"
          onClick={() => handleClick('Faqs')}
          variant="outlined"
          sx={{
            marginBottom: '15px',
            color: 'white',
            width: { sm: '80%', xs: '85%' },
            height: '5.2vh',
            fontSize: { xs: '0.75rem', sm: '1.1rem', md: '1.5rem', lg: '1.7rem' }
          }}
        />
      </Grid2>

    </Grid2>
  );
};

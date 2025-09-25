import { Box, Typography, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

// Componente para un solo mensaje
export const Message = ({ text, isUser, ImageUrl }) => {
  const [displayText, setDisplayText] = useState(isUser ? text : 'Escribiendo');
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isUser) {
      let dotCount = 0;
      const dotsInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4; 
        setDots('.'.repeat(dotCount));
      }, 500); 
  
      const typingTimeout = setTimeout(() => {
        clearInterval(dotsInterval); 
        setDisplayText(text);
        setDots(''); 
      }, 1500);
  
      return () => {
        clearInterval(dotsInterval);
        clearTimeout(typingTimeout);
      };
    }
  }, [text, isUser]);

  const formattedText = (isUser ? text : displayText + dots).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1
      }}
    >
      {ImageUrl && (
        <Box sx={{ marginRight: '10px' }}>
          <img
            src={ImageUrl}
            alt="Imagen del mensaje"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
      <Paper
        sx={{
          p: 1,
          maxWidth: '70%',
          backgroundColor: isUser ? 'third.main' : '#E0E0E0',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" color={isUser ? 'white' : 'black'} sx={{ whiteSpace: 'pre-line' }}>
          <span dangerouslySetInnerHTML={{ __html: formattedText }} />
        </Typography>
      </Paper>
    </Box>
  );
};

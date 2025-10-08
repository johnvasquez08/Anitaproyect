import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Link } from '@mui/material'; // Asegúrate de importar Link

// 1. Añadir 'attachment' a las props
export const Message = ({ text, isUser, ImageUrl, attachment }) => {
  const [displayText, setDisplayText] = useState(isUser ? text : 'Escribiendo');
  const [dots, setDots] = useState('');

  // ⚠️ Paso de Control de Renderizado: 
  // Si no hay texto y no hay adjunto, no renderizamos nada.
  // Esto maneja el caso donde el mensaje puede ser nulo o ignorado.
  if (!text && !attachment) {
    return null;
  }

  // 2. Lógica del efecto de escritura: 
  // Solo se aplica si el mensaje no es del usuario Y tiene texto (no solo adjunto).
  useEffect(() => {
    if (!isUser && text) { // Verificar si hay 'text' aquí
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
    } else if (isUser) {
        // Resetear displayText si es un mensaje de usuario que se actualiza
        setDisplayText(text);
    }
  }, [text, isUser]);

  // Manejar el caso especial cuando no hay texto, pero sí adjunto.
  const contentToDisplay = (isUser || !text) ? text : displayText + dots;
  const formattedText = (contentToDisplay || "").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');


  // Si es un mensaje del bot que SÓLO contiene el adjunto, mostramos un texto de enlace estándar mientras carga.
  // Si no es el usuario Y no tiene texto Y tiene adjunto, el texto por defecto es vacío.
  const finalFormattedText = formattedText || (attachment && !isUser ? '' : formattedText);
  

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
          // Cambiamos 'alignItems' a 'flex-start' para que el texto y el adjunto se alineen verticalmente
          display: 'flex',
          flexDirection: 'column', // Importante para apilar texto y adjunto
          alignItems: 'flex-start', // Alinear contenido a la izquierda
        }}
      >
        {/* Renderizado Condicional del Texto */}
        {(text || !attachment) && ( // Muestra el texto si existe O si es un mensaje sin adjunto (para manejar el estado 'Escribiendo')
          <Typography variant="body1" color={isUser ? 'white' : 'black'} sx={{ whiteSpace: 'pre-line' }}>
            <span dangerouslySetInnerHTML={{ __html: finalFormattedText }} />
          </Typography>
        )}
        
        {/* 3. Renderización del Adjunto */}
        {attachment && attachment.type === 'file' && (
            <Box mt={text ? 1 : 0} // Margen superior solo si hay texto arriba
                p={1} 
                sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fondo claro para resaltar el adjunto
                    borderRadius: 1, 
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            >
                <Typography variant="caption" display="block">
                    Archivo Adjunto:
                </Typography>
                <Link
                    href={attachment.payload.src}
                    download={attachment.payload.title} // Esto fuerza la descarga
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                    sx={{ wordBreak: 'break-all' }} // Evita desbordamiento si la URI es muy larga
                >
                    [📄 Descargar: {attachment.payload.title || 'reporte_empresas.pdf'}]
                </Link>
            </Box>
        )}

      </Paper>
    </Box>
  );
};
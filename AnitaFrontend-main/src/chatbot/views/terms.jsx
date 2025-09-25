import { Grid2, Typography } from '@mui/material'

export const Terms = () => {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: 'calc(100vh - 15px)',
        backgroundColor: 'secondary.main',
        padding: 3,
        color: 'white',
        alignItems: 'center',
        marginTop: '50px'
      }}
    >
      <Grid2 sx={{ width: { sx: '100%', lg: '70%' } }}>
        <Typography variant="h4" gutterBottom align="center">
          Términos y Condiciones
        </Typography>

        <Typography variant="body1" align="left" gutterBottom>
          Última actualización: [30/10/2024]
        </Typography>

        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Estos Términos y Condiciones de Uso (en adelante, los “Términos”) rigen el uso del chatbot de Inside Out (en adelante, el “Chatbot”), propiedad de Inside Out, empresa registrada en México y dedicada a ofrecer servicios de consultoría, marketing y desarrollo de soluciones digitales. Al acceder y utilizar el Chatbot, usted acepta cumplir con estos Términos. En caso de no estar de acuerdo, por favor, absténgase de utilizar el Chatbot.
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Propósito del Chatbot
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          El Chatbot de Inside Out se proporciona como una herramienta de atención al cliente automatizada para responder preguntas comunes, brindar asistencia informativa y ayudar a los usuarios a comprender mejor los servicios que ofrece Inside Out. El Chatbot no es un reemplazo de atención humana directa y está limitado a los alcances establecidos por la empresa.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Uso Permitido
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          El Chatbot está destinado exclusivamente para uso informativo y consulta de los servicios de Inside Out. Queda prohibido utilizar el Chatbot con fines ilegales, malintencionados, o cualquier otro fin no autorizado que pueda perjudicar a Inside Out, sus empleados, sus clientes o sus usuarios.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Limitaciones de Responsabilidad
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Inside Out no se hace responsable de los daños o perjuicios que puedan derivarse del uso del Chatbot, incluyendo, pero no limitado a, errores en la información proporcionada, fallos en el servicio o malentendidos en la interpretación de las respuestas automáticas. Las respuestas generadas por el Chatbot son solo orientativas. Para asistencia personalizada o información específica, se recomienda contactar directamente con el equipo de Inside Out.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Privacidad y Protección de Datos
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Inside Out se compromete a proteger la privacidad de los usuarios. Cualquier dato que se recopile a través del Chatbot será tratado de acuerdo con la Política de Privacidad de Inside Out. Al utilizar el Chatbot, el usuario acepta la recopilación de información necesaria para la mejora del servicio, sin incluir datos sensibles o confidenciales a menos que se especifique en la Política de Privacidad.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Propiedad Intelectual
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Todos los derechos de propiedad intelectual relacionados con el Chatbot, incluyendo, pero no limitado a, el software, la interfaz de usuario, las marcas comerciales y el contenido, son propiedad exclusiva de Inside Out. Los usuarios no están autorizados a reproducir, distribuir, modificar o realizar ingeniería inversa del Chatbot sin el consentimiento expreso y por escrito de Inside Out.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Modificaciones de los Términos
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Inside Out se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones se considerarán efectivas una vez que se publiquen en la plataforma del Chatbot o en el sitio web oficial de Inside Out. Se recomienda a los usuarios revisar estos Términos periódicamente para estar al tanto de las actualizaciones. El uso continuado del Chatbot tras la publicación de cualquier modificación implica la aceptación de los Términos actualizados.
        </Typography>

        <Typography variant="h6" gutterBottom>
          7. Suspensión y Terminación del Servicio
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Inside Out se reserva el derecho de suspender o terminar el acceso al Chatbot en cualquier momento, sin previo aviso, si considera que el usuario ha incumplido con estos Términos o ha hecho un uso indebido del servicio.
        </Typography>

        <Typography variant="h6" gutterBottom>
          8. Ley Aplicable y Jurisdicción
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Estos Términos y Condiciones se regirán por las leyes de México. Cualquier controversia derivada del uso del Chatbot será sometida a la jurisdicción de los tribunales competentes de la Ciudad de México.
        </Typography>

        <Typography variant="h6" gutterBottom>
          9. Contacto
        </Typography>
        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Si tiene preguntas o comentarios sobre estos Términos, puede contactar a Inside Out a través del correo electrónico [email@example.com] o mediante los medios de contacto disponibles en el sitio web oficial.
        </Typography>
      </Grid2>
    </Grid2>
  )
}

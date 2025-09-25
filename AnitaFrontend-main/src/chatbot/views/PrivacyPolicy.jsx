import { Grid2, Typography, List, ListItem } from '@mui/material'

export const PrivacyPolicy = () => {
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
          Aviso de Privacidad
        </Typography>

        <Typography variant="h6" gutterBottom>
          Responsable de la protección de sus datos personales
        </Typography>

        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          BSNS México S.A de C.V. (Identidad México), con domicilio en Troya 36, Col. Villas del Real
          Tecamac, México 55749, México, México, es responsable del tratamiento (uso) de sus datos personales.
        </Typography>

        <Typography variant="h6" gutterBottom>
          ¿Para qué fines recabamos y utilizamos sus datos personales?
        </Typography>

        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Sus datos personales serán utilizados para las siguientes finalidades:
        </Typography>

        <List sx={{ listStyleType: 'disc', paddingLeft: '30px', textAlign: 'justify' }}>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Proveer los productos solicitados.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Proveer los servicios solicitados y/o contratados.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Responder a sus requerimientos de información, atención y servicio.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Evaluar la calidad del servicio que le brindamos.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Archivo de registros y expediente de la relación contractual para seguimiento de servicios futuros.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Gestión financiera, facturación y cobro.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Dar cumplimiento a las obligaciones y compromisos que hemos contraído con usted.
          </ListItem>
        </List>

        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Adicionalmente, sus datos personales podrán ser utilizados para:
        </Typography>

        <List sx={{ listStyleType: 'disc', paddingLeft: '30px', textAlign: 'justify' }}>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Elaborar estudios y programas que son necesarios para determinar hábitos de uso y consumo.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Realizar evaluaciones periódicas de nuestros productos y servicios a efecto de mejorar la calidad de los mismos.
          </ListItem>
          <ListItem sx={{ display: 'list-item', paddingLeft: 0, marginLeft: 0 }}>
            Notificarle sobre nuevos servicios o productos que tengan relación con los ya contratados o adquiridos.
          </ListItem>
        </List>

        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          En caso de que no obtengamos su oposición expresa para que sus datos personales sean tratados también con
          estas finalidades, entenderemos que ha otorgado su consentimiento en forma tácita para ello.
        </Typography>

        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Usted puede conocer los términos y alcances de nuestro Aviso de Privacidad integral en: <a href="http://ap.prodato.mx/514294349" target="_blank" rel="noopener noreferrer" style={{ color: '#6b8d2e' }}>
            http://ap.prodato.mx/514294349
          </a>
        </Typography>

        <Typography variant="body1" align="left" paragraph sx={{ textAlign: 'justify' }}>
          Si después de haber ejercido sus Derechos de Protección de Datos ante BSNS México S.A de C.V. por medio de los
          mecanismos establecidos en este Aviso de Privacidad, considera que su derecho de protección de datos personales
          ha sido lesionado por alguna conducta u omisión de nuestra parte; o cuenta con evidencia de que en el tratamiento de
          sus datos personales existe alguna violación a las disposiciones previstas en la LFPDPPP, le invitamos a ponerse
          en contacto nuevamente con nosotros para agotar todos los procedimientos internos a efecto de satisfacer plenamente
          su solicitud. De no ser el caso, usted podrá interponer la queja correspondiente ante el IFAI. Para mayor información
          visite: <a href="https://www.ifai.org.mx" target="_blank" rel="noopener noreferrer" style={{ color: '#6b8d2e' }}>www.ifai.org.mx</a>
        </Typography>
      </Grid2>
    </Grid2>
  )
}

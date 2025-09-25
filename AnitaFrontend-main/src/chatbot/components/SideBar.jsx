import { TurnedInNot } from '@mui/icons-material'
import { Box, Divider, Drawer, Grid2, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'

export const SideBar = ({ drawerWidth = 240, open, changeSideBar }) => {
  return (
    <Box
      component='nav'
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Drawer para pantallas pequeñas hasta medianas */}
      <Drawer
        variant={'permanent'}
        open={open}
        onClose={changeSideBar} // Cierra el drawer cuando se hace clic fuera en 'temporary'
        ModalProps={{
          keepMounted: true // Mantener montado en pantallas móviles para mejorar el rendimiento
        }}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' }, // Mostrar hasta 'md' (menor de 1200px)
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        <Toolbar sx={{ backgroundColor: '#3FAE49', color: 'white' }}>
          <Typography variant='h6' noWrap component='div'>
            Identidad México
          </Typography>
        </Toolbar>
        <Divider />

        <List>
          {['Preguntas Frecuentes'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton >
                <ListItemIcon>
                  <TurnedInNot />
                </ListItemIcon>
                <Grid2 container>
                  <ListItemText primary={text} />
                </Grid2>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Drawer persistente solo para pantallas grandes (1200px en adelante) */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' }, // Mostrar solo a partir de 'lg' (1200px en adelante)
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        <Toolbar sx={{ backgroundColor: '#3FAE49', color: 'white' }}>
          <Typography variant='h6' noWrap component='div'>
            Identidad México
          </Typography>
        </Toolbar>
        <Divider />

        <List>
          {['Preguntas Frecuentes'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton >
                <ListItemIcon>
                  <TurnedInNot />
                </ListItemIcon>
                <Grid2 container>
                  <ListItemText primary={text} />
                </Grid2>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  )
}

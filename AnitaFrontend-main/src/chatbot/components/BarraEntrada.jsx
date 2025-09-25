import { Box, IconButton, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export const BarraEntrada = ({ inputValue, setInputValue, handleSendMessage }) => {
  return (
    <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 1,
      borderTop: '1px solid #ddd',
      backgroundColor: 'white'
    }}
  >
    <TextField
      variant="outlined"
      placeholder="Escribe tu mensaje"
      fullWidth
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      sx={{ mr: 1 }}
    />
    <IconButton color="primary" onClick={handleSendMessage}>
      <SendIcon />
    </IconButton>
  </Box>
  )
}

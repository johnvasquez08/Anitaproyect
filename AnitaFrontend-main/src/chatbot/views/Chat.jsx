import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { Message, BarraEntrada } from '../components'

// Componente de chat principal
export const ChatComponent = () => {
  const [messages, setMessages] = useState([
    { text: 'Hola, ¿en qué puedo ayudarte?', isUser: false}
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return

    // Agregar mensaje del usuario
    setMessages([...messages, { text: inputValue, isUser: true }])

    // Limpiar el campo de entrada
    setInputValue('')

    // Simular respuesta del bot
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: '¡Estamos trabajando duro para habilitar el chat en vivo!', isUser: false }
      ])
    }, 1000)
  }
  // useEffect para desplazar el scroll hacia abajo cuando haya un nuevo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(90vh)',
        width: '100%',
        justifyItems: 'end',
        marginTop: '64px'
      }}
    >
      {/* Área de mensajes con scroll */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          backgroundColor: '#F5F5F5',
          maxHeight: 'calc(100vh - 160px)' // Altura limitada para que haya espacio para la barra de entrada
        }}
      >
        {messages.map((message, index) => (
          <Message key={index} text={message.text} isUser={message.isUser} />
        ))}
        {/* Referencia para mantener el scroll al fondo */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Barra para la entrada de texto del usuario */}
      <BarraEntrada inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} />

    </Box>
  )
}

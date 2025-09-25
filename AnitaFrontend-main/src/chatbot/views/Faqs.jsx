import { useState, useRef, useEffect } from 'react'
import { Box, Button, Typography, Switch, FormControlLabel} from '@mui/material'
import { Message } from '../components'
import TextField from '@mui/material/TextField';

// Preguntas iniciales
const initialQuestions = [
  '¿Cómo sé que debo contratar servicios de Identidad México?',
  '¿Es necesario pagar grandes cantidades de dinero para tener una estrategia innovadora?',
  '¿Las FINTECH serán el futuro del dinero?',
  '¿Cuál es la tasa de rendimientos esperada al contratar sus servicios?',
  '¿Por qué el robo de identidad digital sigue siendo el delito con mayor índice de crecimiento?'
]

// Respuestas predefinidas del bot para cada pregunta
const botResponses = {
  '¿Cómo sé que debo contratar servicios de Identidad México?':{ 
    response: 'Mientras lees este mensaje, están ocurriendo eventos en la red, millones de ellos contienen información que puede afectar drásticamente a tu organización. Por ejemplo, el fraude y las violaciones de seguridad son los delitos con mayor tasa de crecimiento en el mundo, alcanzando cifras de dos dígitos desde 2013. Sin embargo, lo que queremos hablarte va más allá: se trata de cómo organizarte para servir mejor a tus clientes. Tú, al igual que decenas de organizaciones que generan el 69 % de sus ingresos de manera eficiente, sabrás exactamente qué hacer para aprovechar las oportunidades. Estas se cuentan en millones de millones de pesos. Es un océano azul de posibilidades.',
    image: '/images/14.jpg'

  },
  '¿Es necesario pagar grandes cantidades de dinero para tener una estrategia innovadora?': {
    response: 'No. Definitivamente, el siglo XXI se caracteriza por ofrecer nuevos modelos de negocio, como el software como servicio (SaaS), cobrar por funciones premium mientras se ofrecen funciones básicas sin costo, utilizar plataformas que conectan a compradores y vendedores, apostar por la economía colaborativa, vender directamente a los consumidores eliminando intermediarios, o crear negocios de impacto social con soluciones sostenibles y éticas hacia los clientes. Ya sea a través de microtransacciones o crowdfunding, enfócate en el know-how, porque es la manera de evitar cientos de formas de hacer las cosas que no funcionarán para ti.',
    image: '/images/16.jpg'

  },
  '¿Las FINTECH serán el futuro del dinero?': {
    response:'No. En 1887, se vivió una utopía similar cuando se propuso un lenguaje universal para simplificar la comunicación humana: el esperanto. Otro momento de éxtasis universal fue el surgimiento del internet alrededor de 1960, que prometía democratizar la comunicación humana. Sin embargo, ahora, en manos de grandes capitales, parece inalcanzable para los 575 millones de personas que viven en pobreza extrema. Desde nuestra perspectiva, lo que sí observamos es una gran competencia y un carácter renovado, versátil y ágil, algo que en muchos bancos tradicionales ya no se percibía. Si haces pagos, buscas préstamos, necesitas administrar tus finanzas personales, usar dinero digital, arrendar, rentar, vender, solicitar u ofrecer seguros, fianzas o coaseguros; si utilizas banca en línea, ATMs, TPVs, tokens, celulares o tarjetas; si quieres vender o comprar en corto, en largo, en futuros u opciones, acciones, refinanciamiento, empeño o crowdfunding… Acércate! Te ofrecemos asesoría, infraestructura, tecnología e innovación, ya sea que formes parte de un banco o una FINTECH.',
    image: '/images/19.jpg'
  },

  '¿Cuál es la tasa de rendimientos esperada al contratar sus servicios?': {
    response:'La clave para elegir una consultoría de innovación rentable es realizar un análisis exhaustivo, considerando no solo el costo, sino también la calidad del servicio y su alineación con tus objetivos estratégicos. Una buena relación con el consultor puede marcar la diferencia y potenciar el éxito de tus iniciativas. Nuestras tarifas y servicios de consultoría varían en función de la complejidad del proyecto y la ubicación geográfica. Por ejemplo, en el caso de un desarrollo de océano azul en Ciudad de México, nos enfocamos únicamente en una tarifa por hora que comienza desde $500 por hora. Definir las necesidades específicas es fundamental, pero puede ser un proceso extenso. Por eso, en tan solo 30 minutos, te ofrecemos una sesión informativa donde te explicamos lo que hacemos. A través de herramientas comprobadas y un proceso de autodescubrimiento, podrás realizar un sizing de tus requerimientos. Finalmente, te recomendamos preguntar qué metodologías pueden adaptarse mejor a tu organización para maximizar los resultados.', 
    image: '/images/25.jpg'
  },

  '¿Por qué el robo de identidad digital sigue siendo el delito con mayor índice de crecimiento?': {
    response:'El ciudadano común es especialmente vulnerable al robo de identidad debido a la creciente digitalización de la vida cotidiana y la falta de conciencia sobre la seguridad en línea. Este delito, que consiste en obtener, utilizar o asumir la identidad de otra persona sin su consentimiento para cometer fraudes o delitos, puede implicar el acceso a información personal como nombres, números de identificación, contraseñas, datos bancarios o números de tarjetas de crédito, con el objetivo principal de obtener beneficios financieros, realizar compras, abrir cuentas bancarias o solicitar préstamos en nombre de la víctima, dañando su reputación y su historial crediticio, y generando graves problemas legales y financieros. En la era digital, donde los datos personales están frecuentemente expuestos en línea, este delito se ha convertido en una preocupación creciente tanto para individuos como para empresas; por ello, es esencial protegerse realizando transacciones en sitios seguros y previamente validados, utilizando contraseñas fuertes o sistemas de administración de tokens, aprendiendo sobre ciberseguridad, evitando caer en engaños de delincuentes que se aprovechan de las emociones, manejando redes sociales con precaución y evitando compartir información que no se divulgaría en persona, y minimizando el riesgo de fugas de datos masivas.',
    image: '/images/19.jpg'
  }
}

export const Faqs = () => {
  const [messages, setMessages] = useState([{ text: '¿Cuál es tu pregunta? Estoy aquí para ayudarte.', isUser: false, ImageUrl: '/images/17.jpg'}])
  const messagesEndRef = useRef(null) 
  const [disableButtons, setDisableButtons] = useState(false) 
  const [userMessage, setUserMessage] = useState('') 
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Estado para activar/desactivar la voz
  const [selectedImage, setSelectedImage] = useState(null); // Estado para almacenar la imagen seleccionada o pegada
  const [selectedFile, setSelectedFile] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const senderId = storedUser?.sender_id || "visitante"; // por si no está logueado
  const rasaUrl = "/rasa"; // Usamos la URL relativa configurada en Vite

  const sendMessageToRasa = async (message) => {
  try {
    if (!message.trim() && !selectedFile && !selectedImage) {
      console.warn("No hay mensaje ni imagen para enviar.");
      return;
    }

    let response;
    let data;

    if (selectedFile || selectedImage) {
      const formData = new FormData();
      formData.append("message", message || "");

      if (selectedFile) {
        formData.append("image_data", selectedFile);
      } else if (selectedImage) {
        const imgResponse = await fetch(selectedImage);
        const blob = await imgResponse.blob();
        const file = new File([blob], "image.png", { type: blob.type });
        formData.append("image_data", file);
      }

      response = await fetch(`${rasaUrl}/webhooks/custom_rest/webhooks/custom`, {
        method: "POST",
        body: formData,
      });
    } else {
      response = await fetch(`${rasaUrl}/webhooks/rest/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: senderId, message: message }),
      });
    }

    data = await response.json();

    if (data && data.length > 0) {
      const botMessage = data.map((item) => item.text).join("\n");

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botMessage, isUser: false, ImageUrl: "/images/19.jpg" },
      ]);
    }
  } catch (error) {
    console.error("Error al enviar mensaje o imagen:", error);
  }
};

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file)); // Vista previa
      setSelectedFile(file); // Guardar el archivo para enviarlo
    }
  };

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      for (let item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImage(e.target.result); // Guardamos la imagen pegada
          };
          reader.readAsDataURL(file);
        }
      }
    };
  
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

   // Función para manejar el envío del mensaje
  const handleSendMessage = () => {
    if (userMessage.trim() || selectedImage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, isUser: true, ImageUrl: selectedImage },
      ]);
  
      sendMessageToRasa(userMessage);
      setUserMessage("");
      setSelectedImage(null); // Limpiar la imagen después de enviarla
    }
  };

  //asistente lectura de chat
  const speakMessage = (message) => {
    if (!voiceEnabled) {
      window.speechSynthesis.cancel(); // Detiene cualquier lectura en curso
      return;
    }
  
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Asegura que no haya mensajes pendientes
  
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'es-ES';  // Configurar idioma español (España) o puedes usar 'es' para español general
      utterance.rate = 1;  // Velocidad de habla
      utterance.pitch = 1.2;  // Tono de voz
  
      // Obtener las voces disponibles
      const voices = window.speechSynthesis.getVoices();
      
      // Buscar primero la voz "Sabina"
      const sabinaVoice = voices.find(voice => voice.name.toLowerCase().includes('sabina') && voice.lang.includes('es'));
      
      // Si se encuentra "Sabina", usar esa voz
      if (sabinaVoice) {
        utterance.voice = sabinaVoice;
      } else {
        // Si no se encuentra Sabina, buscar la primera voz femenina en español
        const femaleVoices = voices.filter(voice => voice.lang.includes('es') && voice.gender === 'female');
        utterance.voice = femaleVoices.length > 0 ? femaleVoices[0] : voices[0]; // Usa la primera voz femenina o la primera voz disponible
      }
  
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('API de síntesis de voz no soportada en este navegador.');
    }
  };
  
  
  // Efecto para cortar la voz si se desactiva el toggle
  useEffect(() => {
    if (!voiceEnabled) {
      window.speechSynthesis.cancel(); // Detener cualquier lectura en curso si se desactiva la voz
      return;
    }
  
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser) {
      window.speechSynthesis.cancel(); // Detener cualquier lectura en curso antes de leer
      speakMessage(lastMessage.text);
    }
  }, [messages, voiceEnabled]);
  

  // Función para manejar cuando el usuario selecciona una pregunta
  const handleQuestionClick = (question) => {
    setDisableButtons(true) // Deshabilitar botones
    setMessages((prevMessages) => [...prevMessages, { text: question, isUser: true }])

    // Responder con la respuesta predefinida del bot
    setTimeout(() => {
      const { response, image } = botResponses[question] || {}
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, isUser: false, ImageUrl: image } // Añadimos la imagen a la respuesta
      ])
      setDisableButtons(false) // Rehabilitar botones
    }, 500)
  }

  // Desplazar scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '91vh', // Ocupa toda la altura de la pantalla
        width: { xs: '100%', lg: '100%' },
        marginTop: '64px',
        alignItems: 'center'
      }}
    >
      {/* Opciones de preguntas iniciales */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'white',
          borderBottom: '1px solid #ddd',
          width: { xs: '100%', lg: '65%' },
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Selecciona una pregunta:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {initialQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleQuestionClick(question)}
              sx={{ textAlign: 'left', color: 'third.main', borderColor: 'third.main' }}
              disabled={disableButtons}
            >
              {question}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Área de mensajes con scroll */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          backgroundColor: '#F5F5F5',
          width: { xs: '100%', lg: '70%' },
          maxHeight: 'calc(90vh - 80px)' // Ajuste según la altura de las preguntas iniciales
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            text={message.text}
            isUser={message.isUser}
            ImageUrl={message.ImageUrl} // Mostramos la imagen de la respuesta
          />
        ))}
        {/* Referencia para mantener el scroll al fondo */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Toggle para activar/desactivar la voz */}
      <FormControlLabel
        control={<Switch checked={voiceEnabled} onChange={() => setVoiceEnabled(!voiceEnabled)} />}
        label="Activar lectura por voz"
        sx={{ marginBottom: 1 }}
      />

      {/* Input para escribir el mensaje */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'white',
          borderTop: '1px solid #ddd',
          width: { xs: '100%', lg: '65%' }
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="fileInput"
          onChange={handleFileSelect}
          
        />

        <Button variant="outlined" component="label" htmlFor="fileInput">
          Seleccionar Imagen
        </Button>

        {selectedImage && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            
            <img
              src={selectedImage}
              alt="Vista previa"
              style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <Button onClick={() => setSelectedImage(null)} color="secondary">
              Quitar Imagen
            </Button>
          </Box>
        )}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Escribe tu mensaje..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)} // Actualizar estado con el texto ingresado
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(); // Enviar mensaje al presionar Enter
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSendMessage} // Enviar mensaje
          disabled={disableButtons || !userMessage.trim()}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  )
}
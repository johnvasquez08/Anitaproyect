import { Route, Routes } from 'react-router-dom'
import { ChatbotRoutes } from '../chatbot/routes/ChatbotRoutes'
import AuthRoutes from '../auth/routes/AuthRoutes'  // Asegúrate de importar las rutas de Auth

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Rutas del chatbot */}
      <Route path="/*" element={<ChatbotRoutes />} />

      {/* Puedes agregar otras rutas aquí */}
    </Routes>
  )
}

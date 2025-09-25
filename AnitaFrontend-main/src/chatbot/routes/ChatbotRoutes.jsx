import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ChatbotPage } from '../pages/ChatbotPage'

export const ChatbotRoutes = () => {
  return (
    <Routes>
      <Route path="chat" element={<ChatbotPage />} />
      <Route path="*" element={<Navigate to="/chat" />} />
    </Routes>
  )
}

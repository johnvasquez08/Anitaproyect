import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { Chatbot } from './Chatbot.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter >
      <Chatbot />
    </BrowserRouter>
  </React.StrictMode>
)

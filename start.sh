#!/bin/bash

# Script para iniciar tanto el backend Flask como Rasa

# Función para manejar señales de terminación
cleanup() {
    echo "Terminando procesos..."
    kill $RASA_PID $FLASK_PID 2>/dev/null
    exit 0
}

# Configurar el manejo de señales
trap cleanup SIGTERM SIGINT

# Iniciar Rasa Actions en segundo plano
echo "Iniciando Rasa Actions..."
cd /app/AnitaRasa-main && rasa run actions --port 5055 &
RASA_ACTIONS_PID=$!

# Esperar un poco para que Rasa Actions se inicie
sleep 5

# Iniciar Rasa Server en segundo plano
echo "Iniciando Rasa Server..."
cd /app/AnitaRasa-main && rasa run --enable-api --cors "*" --port 5005 &
RASA_PID=$!

# Esperar un poco para que Rasa se inicie completamente
sleep 10

# Iniciar Flask Backend
echo "Iniciando Flask Backend..."
cd /app/AnitaBackend-main && python app.py &
FLASK_PID=$!

# Esperar a que los procesos terminen
wait
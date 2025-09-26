#!/bin/bash

# Levantar action server en 5055
echo "Iniciando el servidor de acciones..."
rasa run actions --actions actions --port 5055 &

# Levantar el bot en el puerto que Render asigna
echo "Iniciando el servidor de Rasa..."
python run_rasa.py

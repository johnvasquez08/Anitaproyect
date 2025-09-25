#!/bin/bash

# Inicia el servidor de acciones en segundo plano
echo "Iniciando el servidor de acciones..."
rasa run actions --actions actions &

# Ejecuta tu script de Python para iniciar el servidor de Rasa
echo "Iniciando el servidor de Rasa..."
python run_rasa.py
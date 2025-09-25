import os
from dotenv import load_dotenv
import subprocess

load_dotenv()  # Esto carga las variables del archivo .env

# Ejecuta el comando de Rasa
subprocess.run(["rasa", "run", "--enable-api", "--cors", "*", "--debug"])
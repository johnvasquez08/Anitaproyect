import os
from dotenv import load_dotenv
import subprocess

load_dotenv()

# Render pasa el puerto en $PORT
port = os.getenv("PORT", "5005")

subprocess.run([
    "rasa", "run",
    "--enable-api",
    "--cors", "http://localhost:5173",
    "--debug",
    "--port", port
])

import os
import psycopg2
from urllib.parse import urlparse

url = os.getenv("DATABASE_URL", "postgresql://anita_user:uQiLk3tZbNANl1H4STk34OgNdotdmIeV@dpg-d3aokk95pdvs73eofbag-a.oregon-postgres.render.com/anitadb")
parsed_url = urlparse(url)

# Configuración de la base de datos
DB_CONFIG = {
    "dbname": parsed_url.path[1:],  # eliminar el slash inicial
    "user": parsed_url.username,
    "password": parsed_url.password,
    "host": parsed_url.hostname,
    "port": parsed_url.port,
}

def conectar_db():
    """Función para conectar a la base de datos"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("Conexión exitosa a la base de datos")
        return conn
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None

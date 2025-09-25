import psycopg2

# Configuración de la base de datos
DB_CONFIG = {
    "dbname": "anitaDB",  # Tu base de datos
    "user": "anita_user",   # Tu usuario de PostgreSQL
    "password": "developer",  # Tu contraseña
    "host": "localhost"  # O la dirección IP si estás usando un servidor remoto
}

def conectar_db():
    """Función para conectar a la base de datos"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None
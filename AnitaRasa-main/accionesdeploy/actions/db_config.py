import psycopg2

# Configuración de la base de datos
DB_CONFIG = {
    "dbname": "anitadb_klp5",  # nombre de la base de datos
    "user": "anita_user",      # usuario de PostgreSQL
    "password": "jNl1tf80c8hKDMfoGSQK3HXQ4wf3YFAX",  # contraseña del usuario
    "host": "dpg-d48fuf3uibrs7397on80-a.oregon-postgres.render.com",  # host del servidor
    "port": "5432"  # puerto por defecto de PostgreSQL
}

def conectar_db():
    """Función para conectar a la base de datos"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None
import psycopg2

# Configuración de la base de datos
DB_CONFIG = {
    "dbname": "anitadb",  # Tu base de datos
    "user": "anita_user",   # Tu usuario de PostgreSQL
    "password": "uQiLk3tZbNANl1H4STk34OgNdotdmIeV",  # Tu contraseña
    "host": "dpg-d3aokk95pdvs73eofbag-a.oregon-postgres.render.com",
    "port": "5432"  # Puerto por defecto de PostgreSQL

}

def conectar_db():
    """Función para conectar a la base de datos"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
        return None
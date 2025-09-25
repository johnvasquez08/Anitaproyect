import psycopg2

# Configuración de la base de datos
DB_CONFIG = {
    "dbname": "anitaDB",  
    "user": "anita_user",   
    "password": "developer",  
    "host": "localhost"  
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

# Llamar a la función para verificar la conexión
if __name__ == "__main__":
    conectar_db()

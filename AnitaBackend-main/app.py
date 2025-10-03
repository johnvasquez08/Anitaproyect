from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import jwt
import datetime
import requests 
from conectar_db import conectar_db 
from models import db 
import os

app = Flask(__name__)

# Configuracion de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "postgresql://anita_user:uQiLk3tZbNANl1H4STk34OgNdotdmIeV@dpg-d3aokk95pdvs73eofbag-a.oregon-postgres.render.com/anitadb")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar la notificación de cambios en la base de datos

db.init_app(app) # Inicializar la base de datos

with app.app_context():
    db.create_all()  # Esto creará las tablas en la base de datos


# Clave secreta para firmar los JWT
SECRET_KEY = "tu_clave_secreta"  
app.config["SECRET_KEY"] = SECRET_KEY

# Habilitar CORS para todas las rutas
CORS(app)

# Ruta para registrar un nuevo usuario
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Obtener datos JSON
    correo = data.get('correo')
    password = data.get('password')
    nombre = data.get('nombre')

    if not correo or not password:
        return jsonify({"message": "Faltan campos obligatorios"}), 400

    # Encriptar la contraseña
    hashed_password = generate_password_hash(password)

    conn = conectar_db()
    if conn is None:
        return jsonify({"message": "Error al conectar con la base de datos"}), 500

    cursor = conn.cursor()

    # Verificar si el correo ya está registrado
    cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
    user = cursor.fetchone()

    if user:
        return jsonify({"message": "El correo ya está registrado"}), 400

    # Registrar al usuario
    cursor.execute("INSERT INTO usuarios (correo, password, nombre) VALUES (%s, %s, %s)", (correo, hashed_password, nombre))
    conn.commit()

    # Hacer una solicitud a la API de Rasa para obtener el sender_id
    rasa_url = os.getenv("RASA_WEBHOOK_URL", "https://anitaproyectbot-production.up.railway.app/webhooks/rest/webhook")
    payload = {"sender": correo, "message": "inicio de sesión"}
    response = requests.post(rasa_url, json=payload)

    if response.status_code == 200:
        # Extraer el sender_id de la respuesta de Rasa
        sender_id = response.json()[0]["recipient_id"]
        
        # Guardar el sender_id en la base de datos
        cursor.execute("UPDATE usuarios SET sender_id = %s WHERE correo = %s", (sender_id, correo))
        conn.commit()
    else:
        cursor.close()
        conn.close()
        return jsonify({"message": "Error al obtener sender_id desde Rasa"}), 500

    cursor.close()
    conn.close()

    # Generar el token JWT
    token = jwt.encode(
        {"correo": correo, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({
        "message": "Usuario registrado exitosamente!",
        "nombre": nombre,
        "token": token,
        "sender_id": sender_id  # Enviar el sender_id de Rasa
    }), 201
@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        conn = conectar_db()
        if conn is None:
            return jsonify({"message": "No se pudo conectar a la base de datos"}), 500
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"message": "Conexión exitosa", "result": result}), 200
    except Exception as e:
        return jsonify({"message": "Error al conectar a la base de datos", "error": str(e)}), 500

# Ruta para hacer login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Obtener datos JSON
    correo = data.get('correo')
    password = data.get('password')

    conn = conectar_db()
    if conn is None:
        return jsonify({"message": "Error al conectar con la base de datos"}), 500

    cursor = conn.cursor()

    # Buscar usuario por correo
    cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    # Verificar la contraseña
    if not check_password_hash(user[4], password):  # user[2] es la columna password en la tabla
        return jsonify({"message": "Contraseña incorrecta"}), 400

    # Obtener sender_id de Rasa
    # Hacer una solicitud a la API de Rasa para obtener el sender_id para este usuario
    rasa_url = os.getenv("RASA_WEBHOOK_URL", "https://anitaproyectbot-production.up.railway.app/webhooks/rest/webhook")
    payload = {"sender": correo, "message": "inicio de sesión"}
    response = requests.post(rasa_url, json=payload)

    if response.status_code == 200:
        # Extraer el sender_id de la respuesta de Rasa
        sender_id = response.json()[0]["recipient_id"]  # El sender_id es el 'recipient_id' en la respuesta de Rasa
        
        # Guardar el sender_id en la base de datos asociado al usuario
        cursor.execute("UPDATE usuarios SET sender_id = %s WHERE correo = %s", (sender_id, correo))
        conn.commit()
    else:
        return jsonify({"message": "Error al obtener sender_id desde Rasa"}), 500

    # Generar el token JWT
    token = jwt.encode(
        {"correo": correo, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, 
        SECRET_KEY, 
        algorithm="HS256"
    )

    # Si la autenticación es exitosa, devolver el nombre del usuario y el token
    user_name = user[2]  # Suponiendo que el nombre está en la columna 'nombre', en este caso, sería user[3]
    
    cursor.close()
    conn.close()

    return jsonify({
        "message": "Login exitoso!",
        "nombre": user_name,  # Aquí devolvemos el nombre del usuario
        "token": token,  # Enviar el token al cliente
        "sender_id": sender_id  # Enviar el sender_id de Rasa
    }), 200

# Ruta protegida de ejemplo (requiere token)
@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')  # Obtener el token de la cabecera
    if not token:
        return jsonify({"message": "Token no proporcionado"}), 403

    try:
        # Decodificar el token
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        correo = decoded_token["correo"]

        # Recuperar información del usuario usando el correo
        conn = conectar_db()
        cursor = conn.cursor()
        cursor.execute("SELECT nombre FROM usuarios WHERE correo = %s", (correo,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        user_name = user[0]

        cursor.close()
        conn.close()

        return jsonify({"nombre": user_name}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token inválido"}), 401

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)

from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
from actions.db_config import conectar_db
import dateparser
import datetime
from sib_api_v3_sdk.rest import ApiException
import dateparser
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()


def enviar_correo(destinatario, mensaje, asunto="Recordatorio"):
    """Envía un correo usando SMTP de Gmail"""
    remitente = os.getenv("GMAIL_USER")
    password = os.getenv("GMAIL_APP_PASSWORD")

    try:
        # Crear el mensaje de correo
        msg = MIMEMultipart()
        msg['From'] = remitente
        msg['To'] = destinatario
        msg['Subject'] = asunto

        # Cuerpo del correo
        msg.attach(MIMEText(f"<html><body>{mensaje}</body></html>", 'html'))

        # Configurar el servidor SMTP de Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Iniciar TLS
        server.login(remitente, password)  # Login con el correo y la contraseña de aplicación
        server.sendmail(remitente, destinatario, msg.as_string())  # Enviar el correo
        server.quit()  # Cerrar la conexión

        print(f"Correo enviado a {destinatario}")
    except Exception as e:
        print(f"Error enviando correo: {e}")

class ActionGuardarRecordatorio(Action):
    def name(self) -> str:
        return "action_guardar_recordatorio"

    async def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        mensaje = tracker.get_slot('mensaje_recordatorio')
        fecha = tracker.get_slot('fecha_recordatorio')
        sender_id = tracker.sender_id

        if not mensaje or not fecha:
            dispatcher.utter_message(text="No entendí bien el recordatorio. ¿Puedes repetirlo con más claridad?")
            return []

        try:

            fecha_parsed = dateparser.parse(
                fecha,
                settings={
                    'PREFER_DATES_FROM': 'future',
                    'RELATIVE_BASE': datetime.datetime.now(),
                },
                languages=['es']  # Establecer el idioma aquí directamente
            )

            if not fecha_parsed:
                dispatcher.utter_message(text="La fecha proporcionada no es válida. Intenta de nuevo.")
                return []

            # Convertir a un formato que pueda ser insertado en la base de datos (timestamp)
            fecha_str = fecha_parsed.strftime("%Y-%m-%d %H:%M:%S")

            conn = conectar_db()
            if not conn:
                dispatcher.utter_message(text="Hubo un problema al conectar con la base de datos.")
                return []

            cursor = conn.cursor()

            print(f"Buscando usuario con sender_id: {sender_id}")
            cursor.execute("SELECT id, correo FROM usuarios WHERE sender_id = %s", (sender_id,))
            usuario = cursor.fetchone()

            if usuario:
                correo = usuario[1]
                cursor.execute(
                    "INSERT INTO recordatorios (sender_id, mensaje, fecha, estado) VALUES (%s, %s, %s, %s)",
                    (sender_id, mensaje, fecha_str, "activo")
                )
                conn.commit()
                dispatcher.utter_message(text=f"Tu recordatorio para '{mensaje}' ha sido guardado para el {fecha_str}.")

                if correo:
                    asunto = "Confirmación de Recordatorio Guardado"
                    cuerpo = f"""
                    <h2>Tu recordatorio ha sido guardado</h2>
                    <p><strong>Mensaje:</strong> {mensaje}</p>
                    <p><strong>Fecha:</strong> {fecha_str}</p>
                    <p>Te avisaremos cuando esté por vencer.</p>
                    """
                    enviar_correo(correo, cuerpo, asunto)
            else:
                print(f"No se encontró usuario con sender_id {sender_id}")
                dispatcher.utter_message(text="Primero debes registrarte antes de guardar recordatorios.")

            cursor.close()
            conn.close()

        except Exception as e:
            dispatcher.utter_message(text=f"Ocurrió un error al guardar tu recordatorio: {e}")
            print(f"[ERROR] {e}")

        return [SlotSet("mensaje_recordatorio", None), SlotSet("fecha_recordatorio", None)]

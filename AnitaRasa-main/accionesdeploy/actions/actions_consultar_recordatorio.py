from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
from actions.db_config import conectar_db
from dotenv import load_dotenv
import os

load_dotenv()

class ActionConsultarRecordatorios(Action):
    def name(self) -> str:
        return "action_consultar_recordatorios"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        sender_id = tracker.sender_id  # ID del usuario, proporcionado por Rasa

        # Conectar a PostgreSQL usando la función conectar_db()
        conn = conectar_db()
        if not conn:
            dispatcher.utter_message(text="Hubo un problema al conectar con la base de datos.")
            return []

        cursor = conn.cursor()

        # Consultar los recordatorios pendientes usando sender_id
        cursor.execute("SELECT mensaje, fecha FROM recordatorios WHERE sender_id = %s AND estado = 'activo'", (sender_id,))
        recordatorios = cursor.fetchall()

        if recordatorios:
            respuesta = "Tus recordatorios pendientes son:\n"
            for recordatorio in recordatorios:
                respuesta += f"- {recordatorio[0]} para el {recordatorio[1]}\n"
        else:
            respuesta = "No tienes recordatorios pendientes."

        cursor.close()
        conn.close()

        dispatcher.utter_message(text=respuesta)
        return []

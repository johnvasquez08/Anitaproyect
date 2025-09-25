import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from dotenv import load_dotenv
import os

load_dotenv()

# Configuración de la API de OpenRouter (Llama AI)
API_TOKEN = os.getenv("OPENROUTER_API_TOKEN")
MODEL = "meta-llama/llama-3.3-8b-instruct:free"

class ActionSearchLlama(Action):
    def name(self):
        return "action_search_google"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        query = tracker.latest_message.get("text")  # Último mensaje del usuario
        if not query:
            dispatcher.utter_message("No entendí tu pregunta.")
            return []

        # --- Construir historial de la conversación desde Rasa ---
        conversation_history = []
        for event in tracker.events:
            if event.get("event") == "user" and "text" in event:
                conversation_history.append({"role": "user", "content": event["text"]})
            elif event.get("event") == "bot" and "text" in event:
                conversation_history.append({"role": "assistant", "content": event["text"]})

        # Limitar a los últimos 5 mensajes para no gastar muchos tokens
        conversation_history = conversation_history[-5:]

        # Siempre añadimos el contexto de sistema
        system_prompt = {
            "role": "system",
            "content": (
                "Eres un asistente comercial útil llamado Anita. "
                "Tu rol es ayudar a la persona a crear empresa, "
                "emprender y resolver sus dudas comerciales de la mejor manera posible."
            )
        }

        # URL de la API de OpenRouter
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": "application/json"
        }

        # Estructura de datos con historial + último mensaje
        data = {
            "model": MODEL,
            "messages": [system_prompt] + conversation_history + [{"role": "user", "content": query}],
            "temperature": 0.7,
            "max_tokens": 800
        }

        try:
            response = requests.post(url, headers=headers, json=data)
            response_json = response.json()

            print("Respuesta de la API:", response_json)  # Debug

            if "choices" in response_json:
                respuesta = response_json["choices"][0]["message"]["content"]
            else:
                respuesta = "No pude encontrar una respuesta en este momento."

        except Exception as e:
            respuesta = f"Error en la API: {str(e)}"
            print(respuesta)

        dispatcher.utter_message(respuesta)
        return []

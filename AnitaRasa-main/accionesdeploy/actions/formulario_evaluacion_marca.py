from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
from dotenv import load_dotenv
import os

load_dotenv()

# Configuración de Llama (usando OpenRouter)
API_TOKEN = os.getenv("OPENROUTER_API_TOKEN")
MODEL = "meta-llama/llama-3.3-8b-instruct:free"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

class ActionCalcularResultadoMarca(Action):
    def name(self):
        return "action_calcular_resultado_marca"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        # Obtiene los datos de los slots
        tipo_empresa = tracker.get_slot("tipo_empresa")
        respuestas = {f"q{i}": tracker.get_slot(f"q{i}") for i in range(1, 22)}

        # Calcular puntaje total
        puntaje_total = self.calcular_puntaje(tipo_empresa, respuestas)
        
        # Crear el mensaje para Llama basado en el puntaje y respuestas
        prompt = self.generar_prompt(tipo_empresa, respuestas, puntaje_total)

        # Enviar el mensaje a Llama para obtener recomendaciones
        recomendaciones = self.get_llama_recommendations(prompt)

        # Mostrar el puntaje y recomendaciones
        dispatcher.utter_message(f"✅ Tu puntaje total es {puntaje_total}/100.\n\n📌 {recomendaciones}")

        return []

    def calcular_puntaje(self, tipo_empresa, respuestas):
        puntaje_total = 0
        pesos = {
            "ecommerce": [1.0 if i in [11, 12, 13, 14, 15, 16] else 0.5 for i in range(1, 22)],
            "servicios": [1.0 if i in [1, 2, 3, 4, 5, 17, 18, 19, 20] else 0.5 for i in range(1, 22)],
            "otro": [1.0 for _ in range(21)],
        }

        peso_usado = pesos.get(tipo_empresa, pesos["otro"])

        for i in range(1, 22):
            r = respuestas.get(f"q{i}") or 0
            try:
                puntaje_total += float(r) * peso_usado[i - 1]
            except ValueError:
                puntaje_total += 0
        
        if sum(peso_usado) == 0:
            return 0
        else:
            return round((puntaje_total / (5 * sum(peso_usado))) * 100)

    def generar_prompt(self, tipo_empresa, respuestas, puntaje_total):
        # Crear un resumen de las respuestas y el puntaje
        respuesta_texto = "\n".join([f"Pregunta {i}: {respuestas.get(f'q{i}', 'No respondida')}" for i in range(1, 22)])
        
        prompt = f"""
        Basado en las respuestas siguientes para la evaluación de marca de una empresa de tipo {tipo_empresa}, genera una recomendación de mejora para la marca.

        Respuestas:
        {respuesta_texto}

        Puntaje total: {puntaje_total}/100

        ¿Qué recomendaciones tienes para mejorar la imagen de la marca basada en este puntaje y las respuestas?
        """
        return prompt

    def get_llama_recommendations(self, prompt):
        """Envía el análisis a Llama y obtiene recomendaciones."""
        headers = {
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": "application/json"
        }
        data = {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "Eres un asesor experto en branding, marketing y diseño visual."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }

        try:
            response = requests.post(OPENROUTER_URL, headers=headers, json=data)
            response_json = response.json()
            return response_json["choices"][0]["message"]["content"] if "choices" in response_json else "No se pudo obtener una recomendación en este momento."
        except Exception as e:
            return f"Error al obtener recomendaciones de Llama: {str(e)}"

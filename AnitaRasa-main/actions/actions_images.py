import os
import io
import base64
import requests
from google.cloud import vision
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from dotenv import load_dotenv
import os

load_dotenv()

# Configurar credenciales de Google Vision
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_VISION_KEY")

# Configuración de OpenRouter (Llama 3.1-8B)
API_TOKEN = os.getenv("OPENROUTER_API_TOKEN")
MODEL = "meta-llama/llama-3.3-8b-instruct:free"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

class ActionAnalyzeImage(Action):
    def name(self):
        return "action_analyze_image"

    def run(self, dispatcher, tracker, domain):
        # Buscar la imagen en metadata en lugar de entities
        image_data = tracker.latest_message.get("metadata", {}).get("image")

        if not image_data:
            dispatcher.utter_message("No se recibió ninguna imagen. Por favor, sube una imagen para analizar.")
            return []

        # Decodificar la imagen de base64 a bytes
        image_bytes = base64.b64decode(image_data)
        image = vision.Image(content=image_bytes)

        # Inicializar cliente de Google Vision
        client = vision.ImageAnnotatorClient()

        # 1. Etiquetas de la imagen
        label_response = client.label_detection(image=image)
        labels = [label.description for label in label_response.label_annotations]

        # 2. Objetos detectados
        object_response = client.object_localization(image=image)
        objects = [obj.name for obj in object_response.localized_object_annotations]

        # 3. Texto extraído (OCR)
        text_response = client.text_detection(image=image)
        texts = [text.description for text in text_response.text_annotations]

        # 4. Colores dominantes
        color_response = client.image_properties(image=image)
        colors = [
            f"RGB({int(color.color.red)}, {int(color.color.green)}, {int(color.color.blue)}) ({color.score * 100:.2f}%)"
            for color in color_response.image_properties_annotation.dominant_colors.colors[:5]
        ]

        # 5. Brillo estimado
        image_properties = color_response.image_properties_annotation
        brightness = round(
            sum(c.color.red + c.color.green + c.color.blue for c in image_properties.dominant_colors.colors)
            / len(image_properties.dominant_colors.colors), 2
        ) if image_properties.dominant_colors.colors else "No disponible"

        # 6. Análisis de contenido explícito
        safe_response = client.safe_search_detection(image=image)
        safe_data = safe_response.safe_search_annotation
        explicit_content = {
            "Adulto": safe_data.adult,
            "Violencia": safe_data.violence,
            "Médico": safe_data.medical,
            "Contenido Rudo": safe_data.racy,
            "Spoof (falsificación)": safe_data.spoof
        }

        # 7. Puntos de referencia
        landmark_response = client.landmark_detection(image=image)
        landmarks = [landmark.description for landmark in landmark_response.landmark_annotations]

        # 8. Detección de rostros y emociones
        face_response = client.face_detection(image=image)
        emotions_detected = []
        for face in face_response.face_annotations:
            emotions_detected.append({
                "Alegría": face.joy_likelihood,
                "Sorpresa": face.surprise_likelihood,
                "Enojo": face.anger_likelihood,
                "Tristeza": face.sorrow_likelihood
            })

        # Resumen de análisis
        analysis_summary = f"""
        Análisis completo de la imagen:
        - Etiquetas detectadas: {', '.join(labels) if labels else "Ninguna"}
        - Objetos detectados: {', '.join(objects) if objects else "Ninguno"}
        - Texto en la imagen: {', '.join(texts) if texts else "Ninguno"}
        - Colores dominantes: {', '.join(colors) if colors else "No detectados"}
        - Brillo estimado: {brightness}
        - Contenido explícito detectado: {explicit_content}
        - Puntos de referencia: {', '.join(landmarks) if landmarks else "Ninguno"}
        - Emociones detectadas en rostros: {emotions_detected if emotions_detected else "No se detectaron rostros"}
        
        Con base en estos datos, proporciona recomendaciones profesionales sobre cómo mejorar esta imagen para branding, marketing o diseño.
        """

        # Enviar el análisis a Llama para obtener recomendaciones avanzadas
        llama_recommendations = self.get_llama_recommendations(analysis_summary)

        # Responder con el análisis y recomendaciones
        dispatcher.utter_message(analysis_summary)
        dispatcher.utter_message(f"Recomendaciones de Llama:\n{llama_recommendations}")

        return []

    def get_llama_recommendations(self, prompt):
        """Envía el análisis de la imagen a Llama y obtiene recomendaciones."""
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

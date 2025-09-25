from sanic.config import Config
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from rasa.core.channels.channel import InputChannel, CollectingOutputChannel, UserMessage
import base64

# Asegurar que el límite se aplique globalmente antes de crear la app
Config.REQUEST_MAX_SIZE = 200 * 1024 * 1024  # 200MB
Config.REQUEST_TIMEOUT = 300  # 5 minutos
Config.REQUEST_MAX_HEADER_SIZE = 8192 

app = Sanic("rasa_custom_server")
app.config.REQUEST_MAX_SIZE = Config.REQUEST_MAX_SIZE
app.config.REQUEST_TIMEOUT = Config.REQUEST_TIMEOUT
app.config.REQUEST_MAX_HEADER_SIZE = Config.REQUEST_MAX_HEADER_SIZE

print("Tamaño máximo de request en Sanic:", app.config.REQUEST_MAX_SIZE)
print("Tiempo máximo de espera en Sanic:", app.config.REQUEST_TIMEOUT)
print("Tamaño máximo de headers en Sanic:", app.config.REQUEST_MAX_HEADER_SIZE)

class CustomRestInput(InputChannel):
    def name(self):
        return "custom_rest"

    async def _extract_image(self, request: Request):
        """Extrae la imagen y la convierte a base64 si está presente"""
        if "image_data" in request.files:
            image_list = request.files.get("image_data")  # Devuelve una lista
            if isinstance(image_list, list):  
                image = image_list[0]  # Toma el primer archivo si hay varios
            else:
                image = image_list  # Si no es lista, úsalo directamente

            return base64.b64encode(image.body).decode("utf-8")  # Codifica en base64
        
        return None  # No hay imagen

    async def handle_post(self, request: Request, on_new_message):
        sender_id = request.form.get("sender", "default")
        text = request.form.get("message", "")
        image_data = await self._extract_image(request)

        collector = CollectingOutputChannel()
        
        metadata = {}
        if image_data:
            metadata["image"] = image_data

        user_message = UserMessage(text, collector, sender_id, input_channel=self.name(), metadata=metadata)

        await on_new_message(user_message)

        return response.json(collector.messages)

    def blueprint(self, on_new_message):
        custom_webhook = Blueprint("custom_webhook", __name__)

        async def _on_post(request):
            return await self.handle_post(request, on_new_message)

        custom_webhook.add_route(_on_post, "/webhooks/custom", methods=["POST"])
        return custom_webhook

# Registrar el Blueprint en la aplicación Sanic

input_channel = CustomRestInput()
app.blueprint(input_channel.blueprint(None))

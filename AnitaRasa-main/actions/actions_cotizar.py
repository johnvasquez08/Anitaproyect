# actions.py
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
import re
from dotenv import load_dotenv
import os

load_dotenv()

class AmazonRapidAPICotizador:
    def __init__(self, rapidapi_key: str):
        self.rapidapi_key = rapidapi_key
        self.base_url = "https://real-time-amazon-data.p.rapidapi.com/search"
        self.headers = {
            'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
            'x-rapidapi-key': self.rapidapi_key
        }
    
    def buscar_productos(self, query: str, country: str = "MX", max_productos: int = 3):
        params = {
            'query': query,
            'page': 1,
            'country': country,
            'sort_by': "RELEVANCE",
            'product_condition': "ALL",
            'is_prime': False,
            'deals_and_discounts': "NONE"
        }
        
        try:
            response = requests.get(self.base_url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get('status') != 'OK':
                return {'error': f"Error en API: {data.get('status', 'Unknown error')}"}
            
            productos_raw = data.get('data', {}).get('products', [])
            productos_procesados = []
            
            for producto in productos_raw[:max_productos]:
                producto_info = self._procesar_producto(producto)
                if producto_info:
                    productos_procesados.append(producto_info)
            
            return {
                'productos': productos_procesados,
                'total_encontrados': data.get('data', {}).get('total_products', 0)
            }
            
        except Exception as e:
            return {'error': f"Error: {str(e)}"}
    
    def _procesar_producto(self, producto_raw: Dict):
        try:
            nombre = producto_raw.get('product_title', 'Sin título')
            precio = producto_raw.get('product_price', 'No disponible')
            enlace = producto_raw.get('product_url', '')
            rating = producto_raw.get('product_star_rating')
            num_reviews = producto_raw.get('product_num_ratings', 0)
            
            return {
                'nombre': nombre,
                'precio': precio,
                'enlace': enlace,
                'rating': rating,
                'num_reviews': num_reviews
            }
        except:
            return None

class ActionCotizarProducto(Action):
    def name(self) -> Text:
        return "action_cotizar_producto"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Obtener el producto solicitado del slot o de la última entidad
        producto = tracker.get_slot("producto")
        pais = tracker.get_slot("pais") or "MX"
        
        # Si no hay producto en el slot, buscarlo en las entidades del último mensaje
        if not producto:
            entities = tracker.latest_message.get("entities", [])
            for entity in entities:
                if entity.get("entity") == "producto":
                    producto = entity.get("value")
                    break
        
        # Si aún no tenemos producto, pedirlo
        if not producto:
            dispatcher.utter_message(text="¿Qué producto te gustaría cotizar? Por ejemplo: iPhone 15, laptop gaming, etc.")
            return []
        
        # Tu clave de RapidAPI aquí
        API_KEY = os.getenv("RAPIDAPI_KEY")
        
        try:
            cotizador = AmazonRapidAPICotizador(API_KEY)
            resultado = cotizador.buscar_productos(producto, pais, 3)
            
            if 'error' in resultado:
                dispatcher.utter_message(text=f"Lo siento, hubo un problema al buscar {producto}, intenta enviando Cambia a [país] o Cotiza en [país]")
                return [SlotSet("producto", None)]
            
            productos = resultado.get('productos', [])
            
            if not productos:
                dispatcher.utter_message(text=f"No encontré productos para '{producto}'. ¿Podrías intentar con otro término de búsqueda?")
                return [SlotSet("producto", None)]
            
            # Crear respuesta formateada
            total = resultado.get('total_encontrados', 0)
            pais_nombre = self._get_pais_nombre(pais)
            
            respuesta = f"🔍 Encontré {total:,} resultados para '{producto}' en Amazon {pais_nombre}.\n\n"
            respuesta += "🏆 **Top 3 opciones:**\n\n"
            
            for i, prod in enumerate(productos, 1):
                nombre_corto = prod['nombre'][:80] + "..." if len(prod['nombre']) > 80 else prod['nombre']
                respuesta += f"**{i}. {nombre_corto}**\n"
                respuesta += f"💰 Precio: {prod['precio']}\n"
                
                if prod.get('rating'):
                    respuesta += f"⭐ Rating: {prod['rating']}/5 ({prod.get('num_reviews', 0)} reseñas)\n"
                
                respuesta += f"🔗 [Ver producto]({prod['enlace']})\n\n"
            
            respuesta += "¿Te gustaría cotizar otro producto?"
            
            dispatcher.utter_message(text=respuesta)
            
            return [
                SlotSet("producto", None),  # Limpiar el slot para próxima consulta
                SlotSet("ultimo_producto_cotizado", producto)
            ]
            
        except Exception as e:
            dispatcher.utter_message(text=f"Ocurrió un error técnico. Por favor, intenta de nuevo en unos momentos. Error: {str(e)}")
            return [SlotSet("producto", None)]
    
    def _get_pais_nombre(self, codigo_pais: str) -> str:
        paises = {
            "MX": "México",
            "US": "Estados Unidos", 
            "CA": "Canadá",
            "UK": "Reino Unido",
            "DE": "Alemania",
            "FR": "Francia",
            "IT": "Italia",
            "ES": "España"
        }
        return paises.get(codigo_pais, codigo_pais)

class ActionCambiarPais(Action):
    def name(self) -> Text:
        return "action_cambiar_pais"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Obtener el país de las entidades
        nuevo_pais = None
        entities = tracker.latest_message.get("entities", [])
        for entity in entities:
            if entity.get("entity") == "pais":
                nuevo_pais = entity.get("value")
                break
        
        if not nuevo_pais:
            dispatcher.utter_message(text="¿A qué país te gustaría cambiar? Por ejemplo: México, Estados Unidos, etc.")
            return []
        
        # Mapear nombres de países a códigos
        paises_codigo = {
            "méxico": "MX",
            "mexico": "MX", 
            "estados unidos": "US",
            "usa": "US",
            "canadá": "CA",
            "canada": "CA",
            "reino unido": "UK",
            "uk": "UK",
            "alemania": "DE",
            "francia": "FR",
            "italia": "IT",
            "españa": "ES"
        }
        
        codigo_pais = paises_codigo.get(nuevo_pais.lower(), nuevo_pais.upper())
        pais_nombre = nuevo_pais.title()
        
        dispatcher.utter_message(text=f"✅ Perfecto! Ahora buscaré productos en Amazon {pais_nombre}. ¿Qué producto te gustaría cotizar?")
        
        return [SlotSet("pais", codigo_pais)]

class ActionListarPaisesDisponibles(Action):
    def name(self) -> Text:
        return "action_listar_paises"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        respuesta = "🌎 **Países disponibles para cotizar:**\n\n"
        respuesta += "🇲🇽 México (MX)\n"
        respuesta += "🇺🇸 Estados Unidos (US)\n" 
        respuesta += "🇨🇦 Canadá (CA)\n"
        respuesta += "🇬🇧 Reino Unido (UK)\n"
        respuesta += "🇩🇪 Alemania (DE)\n"
        respuesta += "🇫🇷 Francia (FR)\n"
        respuesta += "🇮🇹 Italia (IT)\n"
        respuesta += "🇪🇸 España (ES)\n\n"
        respuesta += "Puedes decir: *'Cambiar a México'* o *'Cotizar en Estados Unidos'*"
        
        dispatcher.utter_message(text=respuesta)
        return []
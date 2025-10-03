import os
import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from bs4 import BeautifulSoup
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph
from dotenv import load_dotenv

load_dotenv()

API_TOKEN = os.getenv("OPENROUTER_API_TOKEN")
MODEL = "meta-llama/llama-3.3-8b-instruct:free"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

class ActionGenerateReport(Action):
    def name(self):
        return "action_generate_report"

    def run(self, dispatcher, tracker, domain):
        urls = tracker.get_slot("company_urls")
        if not urls:
            dispatcher.utter_message("No proporcionaste ninguna URL.")
            return []

        download_dir = os.path.join(os.path.expanduser("~"), "Downloads")
        os.makedirs(download_dir, exist_ok=True)
        pdf_filename = os.path.join(download_dir, "reporte_empresas.pdf")
        c = canvas.Canvas(pdf_filename, pagesize=letter)
        width, height = letter

        for url in urls:
            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                }
                response = requests.get(url, headers=headers, timeout=10)
                if response.status_code != 200:
                    raise Exception(f"Error {response.status_code}: No se pudo acceder a la página.")

                soup = BeautifulSoup(response.text, "html.parser")
                title = soup.title.string if soup.title else "Sin título"
                text_content = " ".join([p.text for p in soup.find_all("p")])[:5000]

                # Obtención de redes sociales y su análisis
                social_links = self.get_social_media_links(soup)
                social_analysis = self.analyze_social_media(social_links)

                # Generación del informe con la información de redes sociales integrada
                llama_report = self.get_llama_report(title, url, text_content, social_analysis)
                llama_report = self.clean_markdown(llama_report)

                self.write_report(c, width, height, title, url, llama_report, social_links)
            except Exception as e:
                self.write_report(c, width, height, "Error en la página", url, f"No se pudo analizar: {str(e)}", {})

        c.save()
        dispatcher.utter_message(f"✅ Reporte generado exitosamente.\n📄 Ubicación: {pdf_filename}")
        
        # LÍNEA PROBLEMÁTICA ELIMINADA - explorer solo funciona en Windows
        # subprocess.Popen(f'explorer "{download_dir}"')
        
        return []

    def get_social_media_links(self, soup):
        social_links = {}
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            if "facebook.com" in href:
                social_links["Facebook"] = href
            elif "instagram.com" in href:
                social_links["Instagram"] = href
            elif "twitter.com" in href or "x.com" in href:
                social_links["Twitter/X"] = href
            elif "linkedin.com" in href:
                social_links["LinkedIn"] = href
            elif "youtube.com" in href:
                social_links["YouTube"] = href
        return social_links

    def analyze_social_media(self, social_links):
        analysis = {}
        for platform, link in social_links.items():
            try:
                headers = {"User-Agent": "Mozilla/5.0"}
                response = requests.get(link, headers=headers, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    posts = " ".join([p.text for p in soup.find_all("p")])[:2000]
                    analysis[platform] = self.summarize_social_media(posts)
                else:
                    analysis[platform] = "No se pudo acceder al contenido."
            except Exception:
                analysis[platform] = "Error al analizar la red social."
        return analysis

    def summarize_social_media(self, posts):
        headers = {"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"}
        prompt = f"Resumen de actividad en redes sociales basado en publicaciones recientes:\n{posts}"
        data = {"model": MODEL, "messages": [{"role": "user", "content": prompt}], "temperature": 0.7}

        try:
            response = requests.post(OPENROUTER_URL, headers=headers, json=data, timeout=15)
            response_data = response.json()
            return response_data.get("choices", [{}])[0].get("message", {}).get("content", "No se pudo generar el resumen.")
        except requests.exceptions.RequestException as e:
            return f"Error al resumir redes sociales: {str(e)}"

    def write_report(self, c, width, height, title, url, report_text, social_links):
        y_position = height - 50
        c.setFont("Helvetica-Bold", 14)
        c.drawString(100, y_position, "Reporte de Empresas")
        y_position -= 30

        c.setFont("Helvetica-Bold", 12)
        c.drawString(100, y_position, f"Empresa: {title}")
        y_position -= 20
        c.setFont("Helvetica", 10)
        c.drawString(100, y_position, f"URL: {url}")
        y_position -= 30

        styles = getSampleStyleSheet()
        justified_style = ParagraphStyle("Justified", parent=styles["Normal"], alignment=4, fontSize=10, leading=14)

        sections = report_text.split("\n\n")
        for section in sections:
            para = Paragraph(section, justified_style)
            text_width, text_height = para.wrap(width - 200, height)
            if y_position - text_height < 50:
                c.showPage()
                y_position = height - 50
            para.drawOn(c, 100, y_position - text_height)
            y_position -= text_height + 10

         # Mejora en el formato de las redes sociales
        if social_links:
            y_position -= 15
            c.setFont("Helvetica-Bold", 12)
            c.drawString(100, y_position, "Redes Sociales:")
            y_position -= 15

            for platform, link in social_links.items():
                para = Paragraph(f"<b>{platform}:</b> <a href='{link}' color='blue'>{link}</a>", justified_style)
                text_width, text_height = para.wrap(width - 200, height)
                if y_position - text_height < 50:
                    c.showPage()
                    y_position = height - 50
                para.drawOn(c, 100, y_position - text_height)
                y_position -= text_height + 10
        else:
            para = Paragraph("No se encontraron redes sociales.", justified_style)
            text_width, text_height = para.wrap(width - 200, height)
            if y_position - text_height < 50:
                c.showPage()
                y_position = height - 50
            para.drawOn(c, 100, y_position - text_height)

    def get_llama_report(self, title, url, text_content, social_analysis):
        headers = {"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"}
        prompt = f"""
        Genera un informe detallado de la empresa:
        - Nombre: {title}
        - URL: {url}
        - Contenido relevante: {text_content}
        
        Estructura:
        1. Introducción: Objetivo del informe y descripción de la empresa.
        2. Principales servicios o productos ofrecidos: Análisis detallado de la oferta de la empresa, incluyendo sus productos o servicios más relevantes.
        3. Público objetivo y mercado principal: Descripción del segmento de clientes al que se dirige la empresa y el alcance de su negocio en el mercado. 
        4. Identidad de Marca: Análisis de logo, diseño visual y página web.
        5. Redes Sociales: Evaluación de presencia digital y estrategia de contenido.
        
        Información obtenida de redes sociales:
        {social_analysis}
        
        6. Competencia: Comparación con empresas similares.
        7. Recomendaciones: Branding, redes y optimización SEO/SEM.
        8. Conclusión: Resumen y próximos pasos.
        """
        data = {"model": MODEL, "messages": [{"role": "user", "content": prompt}], "temperature": 0.7}

        try:
            response = requests.post(OPENROUTER_URL, headers=headers, json=data, timeout=15)
            response_data = response.json()
            return response_data.get("choices", [{}])[0].get("message", {}).get("content", "No se pudo generar el informe.")
        except requests.exceptions.RequestException as e:
            return f"Error al obtener informe: {str(e)}"

    def clean_markdown(self, text):
        replacements = [("**", ""), ("*", ""), ("- ", ""), ("• ", "")]
        for old, new in replacements:
            text = text.replace(old, new)
        return text
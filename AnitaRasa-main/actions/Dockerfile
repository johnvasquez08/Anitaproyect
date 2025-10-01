FROM python:3.9-slim-bullseye

WORKDIR /app

COPY . /app

COPY actions_cotizar.py actions_consultar_recordatorio.py actions_guardar_recordatorio.py actions_images.py actions_questions.py actions_report.py custom_rest.py db_config.py formulario_evaluacion_marca.py requirements.txt ./

USER root

RUN pip install --upgrade pip
RUN pip install rasa==3.6.21
RUN pip install -r requirements.txt

EXPOSE 5055

CMD ["rasa", "run", "actions", "--port", "5055", "--debug"]
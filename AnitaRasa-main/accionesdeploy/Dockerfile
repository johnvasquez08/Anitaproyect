FROM python:3.9-slim-bullseye

WORKDIR /app

COPY actions/ /app/actions/

COPY requirements.txt ./

USER root

RUN pip install --upgrade pip
RUN pip install rasa==3.6.21
RUN pip install -r requirements.txt

EXPOSE 5055

CMD ["rasa", "run", "actions", "--port", "5055", "--debug"]
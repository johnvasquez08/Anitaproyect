#!/bin/bash

echo "=== Iniciando servicios de Anita ==="

# Verificar si existe el modelo de Rasa, si no, entrenarlo
if [ ! -d "/app/AnitaRasa-main/models" ] || [ -z "$(ls -A /app/AnitaRasa-main/models)" ]; then
    echo "No se encontró modelo de Rasa. Entrenando modelo..."
    cd /app/AnitaRasa-main
    rasa train
    echo "Modelo entrenado exitosamente"
fi

# Verificar que las tablas de la base de datos estén creadas
echo "Verificando base de datos..."
cd /app/AnitaBackend-main
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('Base de datos inicializada')
"

echo "Iniciando supervisor con todos los servicios..."
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
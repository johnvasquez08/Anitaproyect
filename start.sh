#!/bin/bash

echo "=== Iniciando servicios de Anita ==="

# Verificar si existe el directorio de Rasa
if [ -d "/app/AnitaRasa-main" ]; then
    echo "Directorio de Rasa encontrado"
    
    # Verificar si existe el modelo de Rasa, si no, entrenarlo
    if [ ! -d "/app/AnitaRasa-main/models" ] || [ -z "$(ls -A /app/AnitaRasa-main/models 2>/dev/null)" ]; then
        echo "No se encontró modelo de Rasa. Entrenando modelo..."
        cd /app/AnitaRasa-main
        rasa train --quiet
        echo "Modelo entrenado exitosamente"
    else
        echo "Modelo de Rasa ya existe"
    fi
else
    echo "Directorio de Rasa no encontrado, continuando solo con Flask"
fi

# Verificar que las tablas de la base de datos estén creadas
echo "Verificando base de datos..."
cd /app/AnitaBackend-main
python -c "
try:
    from app import app, db
    with app.app_context():
        db.create_all()
        print('Base de datos inicializada correctamente')
except Exception as e:
    print(f'Error al inicializar base de datos: {e}')
"

echo "Iniciando supervisor con todos los servicios..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
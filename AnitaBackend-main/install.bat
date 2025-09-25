@echo off
REM Crear el entorno virtual
python -m venv venv

REM Activar el entorno virtual
call venv\Scripts\activate

REM Actualizar pip
python -m pip install --upgrade pip

REM Instalar dependencias desde requirements.txt
pip install -r requirements.txt

REM Dejar un mensaje indicando que el proceso ha finalizado
echo Entorno virtual creado y dependencias instaladas con exito.
pause

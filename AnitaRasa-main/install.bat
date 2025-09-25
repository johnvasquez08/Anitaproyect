@echo off
echo Creando entorno virtual...

REM Crea el entorno virtual
python -m venv rasa_env

REM Activa el entorno virtual
call rasa_env\Scripts\Activate.ps1

echo Instalando dependencias...

REM Actualiza pip
rasa_env\Scripts\python.exe -m pip install --upgrade pip

REM Instala las dependencias desde el requirements.txt
pip install -r requirements-dev.txt

REM Instala setuptools y ml-dtypes explícitamente (por si alguna vez falta)
pip install setuptools==70.3.0
pip install ml-dtypes

echo Instalación completada.
pause
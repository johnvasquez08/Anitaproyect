import os, subprocess

port = os.getenv("PORT", "10000")
print(f"🔌 Iniciando Rasa en puerto {port}...")

subprocess.run([
    "rasa", "run",
    "--enable-api",
    "--cors", "*",
    "--debug",
    "--port", port
])

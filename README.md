# TON Monitor & Sender

Este proyecto contiene scripts en Python 3.11 para monitorear transacciones entrantes y enviar TON o tokens personalizados en la testnet v3R2 de la TON Blockchain. Está pensado para ejecutarse en Windows 10 utilizando PowerShell.

## Requisitos

- Python 3.11

Las dependencias se listan en `requirements.txt`:

```
arduino
ton-client
pyyaml
python-dotenv
uvloop; sys_platform != "win32"
```

## Instalación

En PowerShell, clona este repositorio y prepara el entorno virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

A continuación, crea el archivo `.env` en la raíz con tu seed y claves públicas (se incluye un ejemplo en este repositorio). La variable `TOKENS` deberá contener un diccionario con el símbolo del token y su dirección si se desea enviar tokens personalizados.

## Uso

### Monitor de transacciones entrantes

```powershell
python monitor_incoming.py
```

El script mostrará en pantalla la fecha, dirección de origen, cantidad y etiqueta del mensaje de cada transacción entrante, además de registrar la información en `logs/monitor.log`.

### Envío de TON y tokens

```powershell
python send_transactions.py
```

En el bloque principal se muestran ejemplos para enviar 0.1 TON y 5 tokens `USDT`. Toda la actividad se guarda en `logs/send.log`.

# TON Monitor & Sender

Este proyecto contiene dos scripts para interactuar con la testnet v3R2 de la TON Blockchain.

## Requisitos

- Python 3.11
- Dependencias listadas en `requirements.txt`

## Instalación

```bash
python3.11 -m venv .venv
source .venv/bin/activate  # o .venv\Scripts\activate en Windows
pip install -r requirements.txt
```

## Configuración

Copia el archivo `.env` y edita las variables necesarias:

- `TESTNET_MNEMONIC`: Seed de la wallet de prueba.
- `TESTNET_PUBLIC_KEY`: Dirección pública.
- `LITE_SERVERS`: Endpoint del servidor lite.
- `TOKENS`: Diccionario con los tokens personalizados.

## Uso

### Monitor de transacciones entrantes

```bash
python monitor_incoming.py
```

### Enviar transacciones

```bash
python send_transactions.py
```

# NuestroCodigo

This repository includes basic tools for interacting with the TON blockchain on testnet.

## Scripts

- `monitor.py` – connects to a public lite server and prints incoming transactions for the configured hot wallet.
- `send.py` – sends TON or Jetton transfers from the hot wallet.

Both scripts read configuration from a `.env` file. See `.env.example` for the variables that need to be set.

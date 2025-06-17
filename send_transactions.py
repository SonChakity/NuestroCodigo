from tonclient.client import TonClient
from tonclient.types import ParamsOfSendTransaction, ParamsOfMnemonicWords
from dotenv import load_dotenv
import os
import json
import logging

load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
log_handler = logging.FileHandler('logs/send.log')
log_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(message)s'))
logger.addHandler(log_handler)

client = TonClient(config={"network": {"endpoints": [os.getenv("LITE_SERVERS")]}})


def send_ton(to_address: str, amount: float) -> str:
    """Envía TON de la hot wallet a to_address."""
    mnemonic = os.getenv("TESTNET_MNEMONIC")
    keypair = client.crypto.mnemonic_derive_sign_keys(mnemonic=mnemonic)
    try:
        params = ParamsOfSendTransaction(
            id=0,
            messages=[
                {
                    "address": to_address,
                    "amount": int(amount * 1e9),
                }
            ],
            send_events=False,
        )
        result = client.processing.send_transaction(params=params, signer=keypair)
        tx_hash = result["transaction"].get("id")
        logger.info(f"Envio TON a {to_address} hash {tx_hash}")
        return tx_hash
    except Exception as e:
        logger.error("Error enviando TON", exc_info=e)
        raise


def send_token(token_symbol: str, to_address: str, amount: float) -> str:
    """Envía un token custom desde la hot wallet."""
    tokens = json.loads(os.getenv("TOKENS", "{}"))
    if not tokens:
        raise RuntimeError("La variable TOKENS está vacía. Define SYMBOL->ADDRESS en .env")
    if token_symbol not in tokens:
        raise RuntimeError(f"Token {token_symbol} no definido en TOKENS")
    mnemonic = os.getenv("TESTNET_MNEMONIC")
    keypair = client.crypto.mnemonic_derive_sign_keys(mnemonic=mnemonic)
    token_address = tokens[token_symbol]
    try:
        payload = json.dumps({"transfer": {"to": to_address, "amount": amount}})
        params = ParamsOfSendTransaction(
            id=0,
            messages=[
                {
                    "address": token_address,
                    "amount": 0,
                    "payload": payload,
                }
            ],
            send_events=False,
        )
        result = client.processing.send_transaction(params=params, signer=keypair)
        tx_hash = result["transaction"].get("id")
        logger.info(f"Envio {amount} {token_symbol} a {to_address} hash {tx_hash}")
        return tx_hash
    except Exception as e:
        logger.error("Error enviando token", exc_info=e)
        raise


if __name__ == "__main__":
    print(send_ton("EQATESTDEST…", 0.1))
    print(send_token("USDT", "EQATESTDEST…", 5.0))

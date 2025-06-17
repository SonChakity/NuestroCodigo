from tonclient.client import TonClient
from tonclient.types import ParamsOfSendTransaction, ParamsOfMnemonicWords
from dotenv import load_dotenv
import os
import json
import logging

load_dotenv()

logging.basicConfig(
    filename=os.path.join('logs', 'send.log'),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

client = TonClient(endpoints=[os.getenv('LITE_SERVERS')])


def send_ton(to_address: str, amount: float) -> str:
    """Envía TON de la hot wallet a to_address."""
    mnemonic = os.getenv('TESTNET_MNEMONIC')
    keypair = client.crypto.mnemonic_derive_sign_keys(ParamsOfMnemonicWords(phrase=mnemonic))
    params = ParamsOfSendTransaction(
        from_address=os.getenv('TESTNET_PUBLIC_KEY'),
        to_address=to_address,
        amount=int(amount * 10**9),
        keypair=keypair
    )
    try:
        result = client.processing.send_transaction(params)
        tx_hash = result['transaction']['id']
        logging.info('Enviado %s TON a %s: %s', amount, to_address, tx_hash)
        return tx_hash
    except Exception as e:
        logging.error('Fallo al enviar TON: %s', e)
        raise


def send_token(token_symbol: str, to_address: str, amount: float) -> str:
    """Envía un token custom desde la hot wallet."""
    tokens = json.loads(os.getenv('TOKENS', '{}'))
    if not tokens:
        raise RuntimeError('La variable TOKENS está vacía. Define SYMBOL->ADDRESS en .env')
    if token_symbol not in tokens:
        raise RuntimeError(f'Token {token_symbol} no definido en TOKENS')

    mnemonic = os.getenv('TESTNET_MNEMONIC')
    keypair = client.crypto.mnemonic_derive_sign_keys(ParamsOfMnemonicWords(phrase=mnemonic))
    # Construcción simplificada del payload de transferencia de token
    payload = {
        'token': token_symbol,
        'to': to_address,
        'amount': amount
    }
    params = ParamsOfSendTransaction(
        from_address=os.getenv('TESTNET_PUBLIC_KEY'),
        to_address=tokens[token_symbol],
        amount=0,
        payload=json.dumps(payload).encode(),
        keypair=keypair
    )
    try:
        result = client.processing.send_transaction(params)
        tx_hash = result['transaction']['id']
        logging.info('Enviado %s %s a %s: %s', amount, token_symbol, to_address, tx_hash)
        return tx_hash
    except Exception as e:
        logging.error('Fallo al enviar token %s: %s', token_symbol, e)
        raise


if __name__ == "__main__":
    print(send_ton("EQATESTDEST...", 0.1))
    print(send_token("USDT", "EQATESTDEST...", 5.0))

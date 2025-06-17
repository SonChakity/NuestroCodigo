from tonclient.client import TonClient
from tonclient.types import ParamsOfQueryCollection, ParamsOfMnemonicWords
from dotenv import load_dotenv
import os
import json
import logging
from datetime import datetime

load_dotenv()

logging.basicConfig(
    filename=os.path.join('logs', 'monitor.log'),
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

client = TonClient(endpoints=[os.getenv('LITE_SERVERS')])

try:
    mnemonic = os.getenv('TESTNET_MNEMONIC')
    keypair = client.crypto.mnemonic_derive_sign_keys(ParamsOfMnemonicWords(phrase=mnemonic))
    address = os.getenv('TESTNET_PUBLIC_KEY')

    params = ParamsOfQueryCollection(
        collection='transactions',
        filter={'in_msg': {'direction': {'eq': 'in'}}, 'account_addr': {'eq': address}},
        result='now in_msg{source value message_tag}',
        order=[{'path': 'message_tag', 'direction': 'ASC'}]
    )
    result = client.net.query_collection(params)
    for tx in result['result']:
        ts = tx.get('now', 0)
        frm = tx['in_msg'].get('source')
        amount = int(tx['in_msg'].get('value', '0')) / 10**9
        tag = tx['in_msg'].get('message_tag')
        print(f"{datetime.fromtimestamp(ts)} | from: {frm} | amount: {amount} | tag: {tag}")
        logging.debug(json.dumps(tx))
except Exception as e:
    logging.exception('Error while monitoring transactions: %s', e)

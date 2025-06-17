from tonclient.client import TonClient
from tonclient.types import ParamsOfQueryCollection, ParamsOfMnemonicWords
from dotenv import load_dotenv
import os
import json
import logging
from datetime import datetime

load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
log_handler = logging.FileHandler('logs/monitor.log')
log_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(message)s'))
logger.addHandler(log_handler)

client = TonClient(config={"network": {"endpoints": [os.getenv("LITE_SERVERS")]}})

try:
    mnemonic = os.getenv("TESTNET_MNEMONIC")
    words = ParamsOfMnemonicWords(dictionary="english")
    keypair = client.crypto.mnemonic_derive_sign_keys(mnemonic=mnemonic)
    address = os.getenv("TESTNET_PUBLIC_KEY")

    params = ParamsOfQueryCollection(
        collection="transactions",
        filter={"account_addr": {"eq": address}, "status": {"eq": 3}, "in_msg": {"direction": {"eq": "in"}}},
        result="id now in_msg{source address value message_tag}",
        order=[{"path": "in_msg.message_tag", "direction": "ASC"}],
    )
    result = client.net.query_collection(params=params)

    for tx in result["result"]:
        ts = tx.get("now")
        src = tx["in_msg"].get("source")
        value = int(tx["in_msg"].get("value", 0)) / 1e9
        tag = tx["in_msg"].get("message_tag")
        date = datetime.fromtimestamp(ts).isoformat()
        print(f"{date} from {src} amount {value} tag {tag}")
        logger.debug(json.dumps(tx))
except Exception as e:
    logger.error("Error during monitoring", exc_info=e)
    print(f"Error: {e}")

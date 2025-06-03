import os
import asyncio
import time
import requests
from dotenv import load_dotenv
from pytonlib.client import TonlibClient
from tonsdk.boc import Cell

load_dotenv()
HOT_WALLET_ADDRESS = os.getenv("HOT_WALLET_ADDRESS")
CONFIG_URL = os.getenv("TON_CONFIG_URL", "https://ton-blockchain.github.io/testnet-global.config.json")
KEYSTORE = os.getenv("TON_KEYSTORE", "./keystore")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "15"))
TOKENS_ENV = os.getenv("TOKENS", "")
TOKENS = {}
for token in TOKENS_ENV.split(','):
    if ':' in token:
        addr, symbol = token.split(':', 1)
        TOKENS[addr.strip()] = symbol.strip()


def parse_body(b64_body: str):
    try:
        cell = Cell.one_from_boc(b64_body)
        sl = cell.begin_parse()
        tag = sl.read_uint(32)
        info = {"message_tag": hex(tag)}
        return info
    except Exception as e:
        return {"error": str(e)}


async def monitor():
    if not HOT_WALLET_ADDRESS:
        raise RuntimeError("HOT_WALLET_ADDRESS missing in .env")
    config = requests.get(CONFIG_URL).json()
    client = TonlibClient(ls_index=0, config=config, keystore=KEYSTORE)
    await client.init()
    last_lt = 0
    last_hash = None
    while True:
        try:
            txs = await client.get_transactions(HOT_WALLET_ADDRESS,
                                                from_transaction_lt=last_lt,
                                                from_transaction_hash=last_hash,
                                                limit=10,
                                                decode_messages=False)
            for tx in txs:
                last_lt = int(tx["transaction_id"]["lt"])
                last_hash = tx["transaction_id"]["hash"]
                in_msg = tx.get("in_msg")
                if not in_msg:
                    continue
                if in_msg.get("destination") != HOT_WALLET_ADDRESS:
                    continue
                if in_msg.get("msg_data", {}).get("@type") != "msg.dataRaw":
                    continue
                body = in_msg["msg_data"]["body"]
                info = parse_body(body)
                print("Incoming TX", info)
        except Exception as e:
            print("Monitor error:", e)
        await asyncio.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    asyncio.run(monitor())

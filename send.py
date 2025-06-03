import os
import asyncio
import requests
from dotenv import load_dotenv
from tonsdk.contract.wallet import Wallets, WalletVersionEnum
from tonsdk.contract.token.ft import JettonWallet
from tonsdk.crypto import mnemonic_to_wallet_key
from tonsdk.utils import to_nano, Address
from pytonlib.client import TonlibClient

load_dotenv()
SEED = os.getenv("HOT_WALLET_SEED")
DEST = os.getenv("DESTINATION")
AMOUNT = int(os.getenv("AMOUNT", "0"))
JETTON_WALLET = os.getenv("JETTON_WALLET_ADDRESS")
JETTON_AMOUNT = int(os.getenv("JETTON_AMOUNT", "0"))
CONFIG_URL = os.getenv("TON_CONFIG_URL", "https://ton-blockchain.github.io/testnet-global.config.json")
KEYSTORE = os.getenv("TON_KEYSTORE", "./keystore")

if not SEED:
    raise RuntimeError("HOT_WALLET_SEED missing in .env")

MNEMONICS = SEED.split()
_, pub, priv, wallet = Wallets.from_mnemonics(MNEMONICS, WalletVersionEnum.v3r2, 0)

async def main():
    config = requests.get(CONFIG_URL).json()
    client = TonlibClient(ls_index=0, config=config, keystore=KEYSTORE)
    await client.init()
    seqno_res = await client.raw_run_method(wallet.address.to_string(), 'seqno', [])
    seqno = int(seqno_res['stack'][0]['num'])

    if JETTON_WALLET and JETTON_AMOUNT:
        jw = JettonWallet(address=JETTON_WALLET)
        body = jw.create_transfer_body(
            to_address=Address(DEST),
            jetton_amount=JETTON_AMOUNT,
            forward_amount=0,
            response_address=wallet.address
        )
        msg = wallet.create_transfer_message(
            to_addr=JETTON_WALLET,
            amount=AMOUNT,
            seqno=seqno,
            payload=body
        )
    else:
        msg = wallet.create_transfer_message(
            to_addr=DEST,
            amount=AMOUNT,
            seqno=seqno
        )

    await client.raw_send_message(msg["message"].to_boc(False))
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())

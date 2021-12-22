import * as anchor from "@project-serum/anchor";

export default class NodeWallet {
  payer: anchor.web3.Keypair;

  constructor(payer: anchor.web3.Keypair) {
    this.payer = payer;
  }

  async signTransaction(tx: anchor.web3.Transaction) {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: anchor.web3.Transaction[]) {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey() {
    return this.payer.publicKey;
  }
}

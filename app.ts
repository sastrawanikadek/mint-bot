require("dotenv").config();
import { sign } from "tweetnacl";
import * as anchor from "@project-serum/anchor";
import NodeWallet from "./node-wallet";
import { base58_to_binary, binary_to_base58 } from "base58-js";
import {
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintToken,
} from "./candy-machine";

// (async () => {
//   const secretKey = base58_to_binary(process.env.PHANTOM_PRIVATE_KEY);
//   const me = web3.Keypair.fromSecretKey(secretKey);

//   const connection = new web3.Connection("https://api.devnet.solana.com")
//   const from = me.publicKey;
//   const to = new w3.PublicKey("DEQQziK3JV5zTBGfwxA2RN5wEbveE1nFaBdVYWo8pqcQ");
//   const balance = await connection.getBalance(me.publicKey);
//   const recentBlockhash = await connection.getRecentBlockhash();

//   const transaction = new w3.Transaction({
//     recentBlockhash: recentBlockhash.blockhash,
//     feePayer: from,
//   });
//   transaction.add(
//     w3.SystemProgram.transfer({
//       fromPubkey: from,
//       toPubkey: to,
//       lamports: w3.LAMPORTS_PER_SOL,
//     })
//   );
//   const signature = sign.detached(
//     transaction.serializeMessage(),
//     me.secretKey
//   );
//   transaction.addSignature(from, signature);
//   const isSignatureVerified = transaction.verifySignatures();
//   const response = await w3.sendAndConfirmRawTransaction(
//     connection,
//     transaction.serialize()
//   );

//   console.log(`Block Hash: ${recentBlockhash.blockhash}`);
//   console.log(`Signature Verified: ${isSignatureVerified}`);
//   console.log(`Transaction Response: ${response}`);
// })();

(async () => {
  const connection = new anchor.web3.Connection(
    "https://api.devnet.solana.com"
  );
  const secretKey = base58_to_binary(process.env.PHANTOM_PRIVATE_KEY);
  const me = anchor.web3.Keypair.fromSecretKey(secretKey);
  const wallet = new NodeWallet(me);
  const candyMachineState = await getCandyMachineState(
    wallet,
    new anchor.web3.PublicKey(process.env.CANDY_MACHINE_ID),
    connection
  );

  if (candyMachineState === null) {
    console.log("Error: Not Candy Machine Address");
    return;
  }

  console.log(candyMachineState);

  // try {
  //   const txId = await mintToken(
  //     candyMachineState.candyMachine,
  //     new anchor.web3.PublicKey(process.env.CANDY_MACHINE_CONFIG),
  //     me.publicKey,
  //     new anchor.web3.PublicKey(process.env.CANDY_MACHINE_TREASURY)
  //   );
  //   const status = await awaitTransactionSignatureConfirmation(
  //     txId,
  //     10000,
  //     connection,
  //     "singleGossip",
  //     false
  //   );

  //   if (status !== undefined && !status.err) {
  //     console.log("Mint Success");
  //   } else {
  //     console.log("Mint Failed");
  //   }
  // } catch (error) {
  //   let message = error.msg || "Minting failed! Please try again!";
  //   if (!error.msg) {
  //     if (error.message.indexOf("0x138")) {
  //     } else if (error.message.indexOf("0x137")) {
  //       message = `SOLD OUT!`;
  //     } else if (error.message.indexOf("0x135")) {
  //       message = `Insufficient funds to mint. Please fund your wallet.`;
  //     }
  //   } else {
  //     if (error.code === 311) {
  //       message = `SOLD OUT!`;
  //     } else if (error.code === 312) {
  //       message = `Minting period hasn't started yet.`;
  //     }
  //   }
  //   console.log(message);
  // }
})();

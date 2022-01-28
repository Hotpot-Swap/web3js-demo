import Web3 from 'web3';
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
import { Transaction } from '@ethereumjs/tx';
import Common from '@ethereumjs/common';

const sendBNB = async () => {
  try {
    const rawTx = {
      nonce: web3.utils.toHex(await web3.eth.getTransactionCount("0x59F294Dd6e25496D28C0c94c227085F7C851DE57", 'pending')),
      gasLimit: 21000,
      gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      to: "0x245BFb5F9470E269a1ebCC9329399f9c59C58FfF",
      data: "0x",
      value: web3.utils.toHex(0.000001 * 10 ** 18),
    }
    const common = Common.custom({ chainId: 97 })
    const privateKey = Buffer.from("e7c43aa46f68531b9442a30061bcb04fb73fd908827d86e5b3669ae3120db9cf", 'hex');
    const tx = Transaction.fromTxData(rawTx, {common})
    tx.sign(privateKey)
    const serializedTx = tx.serialize()

    web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err) {
          console.log('hass');
          console.log(hash);
        } else {
          console.log('erro1');
          console.log(err);
        }
      })
  } catch (error) {
    console.log(error);
  }
};
sendBNB();

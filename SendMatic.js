const Web3 = require("web3");
const web3 = new Web3('https://rpc-mumbai.matic.today');
const Common = require('ethereumjs-common').default;
var Tx = require('ethereumjs-tx').Transaction;

const sendMatic = async (fromAddress, toAddress, amount) => {
  try {
    const rawTx = {
      nonce: web3.utils.toHex(await web3.eth.getTransactionCount(fromAddress)),
      gasLimit: 21000,
      gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      to: toAddress,
      data: "0x",
      value: web3.utils.toHex(amount * 10 ** 18),
    }

    const customCommon = await Common.forCustomChain(
      'mainnet',
      {
        name: 'my-network',
        networkId: 123,
        chainId: 80001,
      },
      'petersburg',
    )
    const privateKey = Buffer.from("fa0ce4c779a370bc3a7419a9ce1025b7ad83dd61c05d2cc150dd40f36312d6de", 'hex');
    const tx = new Tx(rawTx, {common: customCommon})
    tx.sign(privateKey)
    const serializedTx = tx.serialize()

    web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err) {
          console.log(hash);
        } else {
          console.log(err);
        }
      })
      .once('confirmation', () => {
        console.log('confirmation')
      })
      .on('receipt', console.log)
      .once('transactionHash', e => {
        console.log('transactionHash')
      });
  } catch (error) {
    console.log(error);
  }
};
sendMatic('0xEDd3d787C7abecDE82c066b0C99b4d5B3aA69DA4', '0xdB8E6b10d88370B7E959718d3d2f78f73Fe38784', 0.001);
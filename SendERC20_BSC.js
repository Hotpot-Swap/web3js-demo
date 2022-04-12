const Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction;
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/93064dcdd7e34fc99d640478b2acabdf"));
const ABI = require('./ABI.json').abi;
const BigNumber = require('bignumber.js');
const Math = require('mathjs');
const Common = require('ethereumjs-common').default;

const sendERC20 = async (fromAddress, toAddress, token, amount, gasLimit) => {
  try {
    const Erc20contract = new web3.eth.Contract(ABI, token);
    const decimalToken = await Erc20contract.methods.decimals().call();
    var sendAmount = new BigNumber(amount).multipliedBy(Math.pow(10, decimalToken));
    const data = Erc20contract.methods.transfer(toAddress, sendAmount.toFixed());
    // 2. create approve tx parameters
    const approveTxParams = {
      nonce: web3.utils.toHex(await web3.eth.getTransactionCount(fromAddress, 'pending')),
      gasLimit:
        gasLimit > 21000 && gasLimit <= 5000000
          ? Number(gasLimit)
          : web3.utils.toHex(await data.estimateGas({ from: fromAddress })),
      gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      to: token,
      data: data.encodeABI(),
      value: '0x00' // 0
    };
    console.log(approveTxParams);

    const customCommon = await Common.forCustomChain(
      'mainnet',
      {
        name: 'my-network',
        networkId: 123,
        chainId: 97,
      },
      'petersburg',
    )
    // 3. sign transaction
    const tx = new Tx(approveTxParams, { common: customCommon });

    const privateKey = Buffer.from('440331baae95b9bd06329558f61c05cf28f64b50c76e3ba5ae6c0f6179b1db52', 'hex'); // private key cua vi gui
    tx.sign(privateKey);
    var serializedTx = tx.serialize();

    // 4. send signed transaction
    // await web3.eth
    //   .sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
    //     if (!err) {
    //       console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
    //     } else {
    //       console.log(err);
    //     }
    //   })
    //   .once('confirmation', () => {
    //     console.log('confirmation')
    //   })
    //   .once('transactionHash', e => {
    //     console.log('transactionHash')
    //   });

      await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then(async (result) => {
        const txSwapHash = result.transactionHash
        // console.log(`${this.classname}::sendTxSwap id=${unprocessedRecord._id} to=${unprocessedRecord.to} amount=${unprocessedRecord.amount.toString()} txSwapHash=${txSwapHash}`);
        // sendEventSocket("swapERC", {
        //   receipt_hash: txSwapHash,
        //   tx_hash: unprocessedRecord.txHash,
        //   address: unprocessedRecord.from
        // })
        // unprocessedRecord.txSwapHash = txSwapHash;
        // unprocessedRecord.status = STATUS.COMPLETED;
        // await unprocessedRecord.save();
        console.log('txSwapHash: ', txSwapHash);
      }).catch(async err => {
        console.log("-----------------------------------------------------")
        console.log(err.message);
        // unprocessedRecord.txSwapNonce = null;
        // unprocessedRecord.txSwapRaw = null;
        // unprocessedRecord.txSwapSender = null;
        // await unprocessedRecord.save();
      });

  } catch (error) {
    console.log(error);
  }
}
sendERC20(
  '0x400eE0C820144c8Bb559AcE1ad75e5C13e750334',
  '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee',
  12,
  21000);

const Web3 = require("web3");
const Tx = require('ethereumjs-tx').Transaction;
const web3 = new Web3('https://rpc-mumbai.matic.today');
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
        chainId: 80001,
      },
      'petersburg',
    )
    // 3. sign transaction
    const tx = new Tx(approveTxParams, { common: customCommon });

    const privateKey = Buffer.from('fa0ce4c779a370bc3a7419a9ce1025b7ad83dd61c05d2cc150dd40f36312d6de', 'hex'); // private key cua vi gui
    tx.sign(privateKey);
    var serializedTx = tx.serialize();

    // 4. send signed transaction
    await web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err) {
          console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
        } else {
          console.log(err);
        }
      })
      .once('confirmation', () => {
        console.log('confirmation')
      })
      .once('transactionHash', e => {
        console.log('transactionHash')
      });
  } catch (error) {
    console.log(error);
  }
}
sendERC20(
  '0xEDd3d787C7abecDE82c066b0C99b4d5B3aA69DA4',
  '0xdB8E6b10d88370B7E959718d3d2f78f73Fe38784',
  '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
  0.001,
  21000);

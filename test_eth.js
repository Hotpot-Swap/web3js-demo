const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/127e91b3eaa940d1a9e070cef5cae0b3"
  )
);

var Tx = require("ethereumjs-tx").Transaction;

const sendETH = async (address, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rawTx = {
        nonce: web3.utils.toHex(
          await web3.eth.getTransactionCount(address, "pending")
        ),
        gasLimit: 41000,
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        to: "0x400eE0C820144c8Bb559AcE1ad75e5C13e750334", //vi nhan
        data: "0x1121",
        input: "0x1131",
        value: web3.utils.toHex(amount * 10 ** 18), // 0
      };
      console.log(rawTx);
      const tx = new Tx(rawTx, { chain: "rinkeby" });
      const privateKey = Buffer.from(
        "fa0ce4c779a370bc3a7419a9ce1025b7ad83dd61c05d2cc150dd40f36312d6de",
        "hex"
      ); // private key cua vi gui
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      var hashR;

      web3.eth
        .sendSignedTransaction(
          "0x" + serializedTx.toString("hex"),
          function (err, hash) {
            if (!err) {
              console.log("hash", hash);
              resolve(hash);
            } else {
              console.log(err);
            }
          }
        )
        .once('confirmation', () => {
          console.log('confirmation')
        });
    } catch (error) {
      reject(error)
    }
  });
};
sendETH("0xEDd3d787C7abecDE82c066b0C99b4d5B3aA69DA4", 0.0001).then((data) => console.log('data: ', data)).catch(err => console.log('err: ', err));;
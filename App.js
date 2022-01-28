const ethers = require('ethers');

const ABI = require('./ABITreasury.json');

const mnemonic = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbb';
const ADDRESS_TREASURY = '0xA7a8e25764f8eB6Ac29756e471815ac37d1D33B3'

const provider = new ethers.providers.getDefaultProvider('https://rinkeby.infura.io/v3/bee5f5bb9ff54d63a1ca8c7ea45a4fe2');
const wallet = new ethers.Wallet(mnemonic);
const account = wallet.connect(provider);
const treasury = new ethers.Contract(
  ADDRESS_TREASURY,
  ABI,
  account
);

const claim = async (ref, amount) => {
  try {
    const tx = await treasury.claimFriends(
      ref,
      ethers.utils.parseEther(amount)
    );
    console.log('tx', tx);
    const receipt = await tx.wait(); 
    console.log('Transaction receipt');
    console.log(receipt);
    process.exit(0);
  } catch(e){
    console.log(e.message);
    // process.exit(0);
  }
  
}

claim('0xcEa65dEB160A64d8e99BA48311b56bAED2b80E66', '100');
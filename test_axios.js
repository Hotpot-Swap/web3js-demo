const axios = require("axios");
let url =
  "https://api-testnet.bscscan.com/api?module=account&action=txlist&address=0x400ee0c820144c8bb559ace1ad75e5c13e750334&startblock=0&endblock=999999999&sort=desc&apikey=P3A263376TPJHKQ5IXUD4VHUNFQKDJB4G5";

async function get(url) {

    const res = await axios.get(url, {
      timeout: 1000,
    });
   if (res){
        console.log('comin')
   }

}
get(url);

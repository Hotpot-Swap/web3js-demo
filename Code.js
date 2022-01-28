// secret là mã bí mật của mình
const secret = 2;
function code(pk){
    let length = pk.length;
    let pkTmep;
    let first = pk[0];
    let last = pk[length - 1];
    pkTmep = last + pk.slice(1,length-1) + first;
    let output='';
    for (let i = 0; i < pkTmep.length; i++){
        let chartCode = pkTmep.charCodeAt(i);
        output += String.fromCharCode(chartCode + secret)
    }
    console.log(output);
}
// đầu vào là private key
code(`private key`);
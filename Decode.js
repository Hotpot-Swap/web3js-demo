// secret là mã bí mật của mình
const secret = 2;
function Decode(pk){
    let output = '';
    for (let i = 0; i < pk.length; i++){
        let chartCode = pk.charCodeAt(i);
        output += String.fromCharCode(chartCode - secret)
    }
    let length = output.length;
    let first = output[0];
    let last = output[length - 1];
    console.log(last + output.slice(1,length-1) + first)
}
// đầu vào là mã công khai
Decode(`{tkxcvg"mgr`);
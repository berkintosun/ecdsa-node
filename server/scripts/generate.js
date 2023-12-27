const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")


const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey,false);
const address = utils.toHex(keccak256(publicKey.slice(1)).slice(-20))
const params = process.argv.slice(2);


if(params.length == 2){
    console.log(params)
    const signature = secp256k1.sign(params[0], params[1])
    console.log("signature hex = ",signature.toCompactHex())
    console.log("signature recovery bit = ",signature.recovery)
    console.log(signature)
    

}
else{
    console.log("private key ",utils.toHex(privateKey))
    console.log("public key ",utils.toHex(publicKey))
    console.log("public key compressed", utils.toHex(secp256k1.getPublicKey(privateKey,true)))
    console.log("address ",address)
}
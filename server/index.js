const express = require("express");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const utils = require("ethereum-cryptography/utils")

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "53c1a2c42afd76ba97aec4eaf254d7d731ae6ec1": 100,
  /*
  private key  026cf2eac32fd828b17a962677a1bf5b824bdd26a0926aefcabafe91bad0a468
public key  045046ec1da35808a1ae702d5bdb17221fbdf065f2b855da78cd816eaedf5615c7955b873b652702d40bdded0d11ceb068ff2a25d6fcf149aab5fa8d31531827f6
public key compressed 025046ec1da35808a1ae702d5bdb17221fbdf065f2b855da78cd816eaedf5615c7  
address  53c1a2c42afd76ba97aec4eaf254d7d731ae6ec1
*/
  "4b3a74573272a476fda30fd11bfb6307632361fe": 50,
  /*
  private key  bea6d8ddac2e74409e58d75f3afcc58b832151894bbeb11923a36f410c011046
public key  04233b19a8020104150dba881a45f60acee720225a66653acb4113af9d5a5670c86a9ed424e375645605f64537a0eabc5fd56146ed4d8fc7faaf5c2b747b2bf5ac
public key compressed 02233b19a8020104150dba881a45f60acee720225a66653acb4113af9d5a5670c8  
address  4b3a74573272a476fda30fd11bfb6307632361fe
*/
  "22f9edefe1daf5ba90ad0e80a62d357923e94b07": 75,
  /* 
  private key  48e8e90e0c34156e47036cccdec8847fb0039de4d93789fef20b2f33374a147f
public key  041ff5a7b992166670855aaff73b28dd782afa8fc957a7a9d89af0b21865a4291fcb43d4fb81f5c680535432468cfd9f3c112ecb65a3a6da809794c577d8abadbb
public key compressed 031ff5a7b992166670855aaff73b28dd782afa8fc957a7a9d89af0b21865a4291f  
address  22f9edefe1daf5ba90ad0e80a62d357923e94b07
*/ 
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});


app.post("/send", (req, res) => {
  const { recipient, amount, timestamp, signature, recovery } = req.body;
  const hashedMessage = keccak256(utils.utf8ToBytes(JSON.stringify({recipient,amount,timestamp})))
   let sign;
   let senderPub;
  try {
    sign = secp256k1.Signature.fromCompact(signature).addRecoveryBit(parseInt(recovery))
    senderPub = sign.recoverPublicKey(hashedMessage)
    secp256k1.verify(sign,hashedMessage,senderPub.toHex())
    // This verification process is unnecessary as we generate Public key from signature itself
    // we will always find a public key that can verify this signature.
    // If we had a system that stores public keys locally or 3rd party trust system, then it would mean something.
    // I decided to keep that line as I get questions about non-existance of verify functionality and this might clear some confusion.
  } catch (error) {
    return res.status(403).send({message: "Signature Malfunction"})
  }
  const sender = utils.toHex(keccak256(senderPub.toRawBytes(false).slice(1)).slice(-20))

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < parseInt(amount)) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= parseInt(amount);
    balances[recipient] += parseInt(amount);
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

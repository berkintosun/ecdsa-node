import { useEffect, useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak"
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils"

function Transfer() {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [timestamp, setTimestamp] = useState(Date.now());
  const [jsonHash, setJsonHash] = useState();
  const [signature, setSignature] = useState();
  const [recovery, setRecovery] = useState();
  


  useEffect(() =>{
    const time = Date.now()
    setTimestamp(time)
    setJsonHash(toHex(keccak256(utf8ToBytes(JSON.stringify({recipient,amount: sendAmount,timestamp: time})))))
  },[sendAmount, recipient])

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {recipient,amount: sendAmount,timestamp, signature,recovery});
      alert(`Transfer completed. ${balance} Balance left `);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>Sign this Hash = {jsonHash ?? "Fill the form for the hash!"}</label>
      <label>
        Hash of your signature
        <input
          placeholder="your signature in hash format"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>
      <label>
        Recovery bit of your signature
        <input
          placeholder="your signatures recovery bit"
          value={recovery}
          onChange={setValue(setRecovery)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

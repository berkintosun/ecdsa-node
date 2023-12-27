import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Wallet/>
      <Transfer/>
    </div>
  );
}

export default App;

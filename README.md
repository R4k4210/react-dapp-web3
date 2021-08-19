# react-dapp-web3

`react-dapp-web3` is a simply library for handling Metamask and WalletConnect providers
and make the use of Web3 easier through the application.
The library put at disposal the following methods: `connect`, `disconnect` and `signMessage`.

## Installation

```
yarn add react-dapp-web3
npm install react-dapp-web3
```

# Usage

### InfuraId for WalletConnect

WalletConnect needs the InfuraId. Create a .env file in your project and add the following
enviroment variable `REACT_APP_INFURA_ID=<your-infuraid>`.

### Import ContextProvider for wrapping your app

```
import { Web3ContextProvider } from "react-dapp-web3";
import Layout from "./components/Layout";

function App(): JSX.Element {
    return (
        <div className="App">
            <Web3ContextProvider>
                <Layout />
            </Web3ContextProvider>
        </div>
    );
}

export default App;
```

### High Order Component

```
import { withWeb3 } from "react-dapp-web3";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "../Navbar";

const Layout = (): JSX.Element => {
    return (
        <Router>
            <Switch>
                <Route exact path={"/"} component={withWeb3(Navbar)} />
            </Switch>
        </Router>
    );
};

export default Layout;
```

```
import { IWithWeb3 } from "react-dapp-web3";

const Navbar = ({ web3Data }: IWithWeb3): JSX.Element => {
    const { isWalletConnected, walletAddress, signature, web3, connect, disconnect, signMessage } = web3Data;
    ...
```

### Hook

```
import { useWeb3 } from "react-dapp-web3";

const Navbar = (): JSX.Element => {
    const { isWalletConnected, walletAddress, signature, web3, connect, disconnect, signMessage } = useWeb3();
    ...

```

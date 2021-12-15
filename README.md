# react-dapp-web3

`react-dapp-web3` is a simply library for handling Metamask and WalletConnect providers
and make the use of Web3 easier through the application.
The library put at disposal the following methods: `connect()`, `disconnect()` -WalletConnect only- and `signMessage(msgToSign)`.
You can also access to `isWalletConnected: boolean`, `walletAddress: string}`, `chainId: number`,
`isInitialized: boolean` and `web3` instance for Smart Contract communication.

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
    const { isWalletConnected, walletAddress, chainId, web3, connect, disconnect, signMessage } = web3Data;
    ...
```

### Hook

```
import { useWeb3 } from "react-dapp-web3";

const Navbar = (): JSX.Element => {
    const { isWalletConnected, walletAddress, chainId, web3, connect, disconnect, signMessage } = useWeb3();
    ...

```

# Types

### All types are in [types](https://github.com/R4k4210/react-dapp-web3/blob/main/src/types/types.ts) folder.

# Contribute

Feel free to contribute.
All suggestions to help improve this library are welcome.

### Donations

If you like the extension and you want to support the development - please consider to donate. Any donations are greatly appreciated :D !!

**ERC20 - 0x3079c9aC68b629419213A864dc1899Ab4fC7246B**
**BEP20 - 0xdc97501024f7022649c505bfd8d7c0a78ccdf593**

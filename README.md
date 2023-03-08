# react-dapp-web3

`react-dapp-web3` is a simple library for handling Metamask and WalletConnect providers
and make the use of Web3 easier.
The library put at disposal the following methods: `connect()`, `disconnect()` -WalletConnect only- and `signMessage(msgToSign)`.
You can also access to `isWalletConnected: boolean`, `walletAddress: string`, `chainId: number`,
`isInitialized: boolean` and `web3` instance for Smart Contract communication.

## Installation

```
yarn add react-dapp-web3
npm install react-dapp-web3
```

# Usage

### WalletConnect V2 (V1 was deprecated)

WalletConnect V2 needs the ProjectId and ChainIds. To add the providers configuration, you have to pass an object
containing the configuration. In this way the library is prepared to handle more providers in future, like Coinbase.

```
{
    walletConnectV2: {
        projectId: "<your-projectId>",
        chainIds: [1],
    },
}
```

### Import ContextProvider for wrapping your app

```
import { Web3ContextProvider } from "react-dapp-web3";
import Layout from "./components/Layout";

const providersConfig = {
    walletConnectV2: {
        projectId: "<your-projectId>",
        chainIds: [1],
    },
}

function App(): JSX.Element {
    return (
        <div className="App">
            <Web3ContextProvider config={providersConfig}>
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

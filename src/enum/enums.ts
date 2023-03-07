export enum EActionTypes {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    BLOCK = "BLOCK",
    WALLET_CHANGED = "WALLET_CHANGED",
    CHAIN_CHANGED = "CHAIN_CHANGED",
}

export const EMPTY = "";

export enum EProviderEvents {
    DISCONNECT = "disconnect",
    ACCOUNTS_CHANGED = "accountsChanged",
    CHAIN_CHANGED = "chainChanged",
}

export enum EErrors {
    WEB3_INSTANCE = "Web3 is not initialized",
    WALLET_ADDRESS = "Wallet address is empty",
    METAMASK_DISCONNECT = "Disconnect in MetaMask is not implemented",
    WALLET_CONNECT_CONFIG = "WalletConnect config is needed",
}

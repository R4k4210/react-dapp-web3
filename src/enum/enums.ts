export enum EActionTypes {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  BLOCK = "BLOCK",
  WALLET_CHANGED = "WALLET_CHANGED",
  SIGN_MESSAGE = "SIGN_MESSAGE",
}

export enum EProvider {
  METAMASK = "rdw_metamask",
  WALLETCONNECT = "rdw_walletconnect",
  SIGNATURE = "rdw_signature",
  NONE = "",
}

export enum EProviderEvents {
  DISCONNECT = "disconnect",
  ACCOUNTS_CHANGED = "accountsChanged",
  CHAIN_CHANGED = "chainChanged",
}

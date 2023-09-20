import Web3 from "web3";
import { useContext, useEffect, useMemo, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { EActionTypes, EErrors, EMPTY, EWalletProviders } from "../enum/enums";
import MetaMask from "../wallets/MetaMask";
import WalletConnectV2 from "../wallets/WalletConnectV2";
import Coinbase from "../wallets/Coinbase";

interface IUseWeb3Test {
  isWalletConnected: boolean;
  walletAddress: string;
  chainId: number;
  isInitialized: boolean;
  web3: Web3 | null;
  connect: (provider: EWalletProviders) => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

const useWeb3 = (): IUseWeb3Test => {
  const [isInitialized, setIsInitialized] = useState(false);

  const { state, dispatch } = useContext(Web3Context);
  const { walletAddress, web3, provider, chainId, isWalletConnected, config } = state;

  const requestedProvider = useMemo(() => {
    return {
      [EWalletProviders.METAMASK]: MetaMask(),
      [EWalletProviders.WALLET_CONNECT_V2]: WalletConnectV2(config?.walletConnectV2!),
      [EWalletProviders.COINBASE]: Coinbase(config?.coinbase!),
    };
  }, [provider]);

  useEffect(() => {
    if (!provider || !web3) return;
  }, []);

  useEffect(() => {
    if (!provider || !web3) return;
    requestedProvider[provider].registerEvents();
  }, [provider, web3]);

  /**
   * Initialize connection with provider
   */
  const connect = async (walletProvider: EWalletProviders): Promise<void> => {
    const currentProvider = await requestedProvider[walletProvider].getProvider();
    const web3 = new Web3(currentProvider);

    console.log("isEnabled", await requestedProvider[walletProvider].isEnabled());
    if (!(await requestedProvider[walletProvider].isEnabled())) {
      await currentProvider.connect();
    }

    const address = await web3.eth.getAccounts();
    dispatchAction(EActionTypes.CONNECT, web3, provider, address[0], chainId, true);
  };

  const disconnect = async (): Promise<void> => {
    if (!provider) {
      return;
    }
    await requestedProvider[provider].disconnect();
    dispatchAction(EActionTypes.DISCONNECT, null, null, EMPTY, 0, false);
  };

  /**
   * Sign and return signed message
   * @param {string} message - Message to sign
   * @return {string} signed message
   */
  const signMessage = async (message: string): Promise<string> => {
    if (!web3) {
      throw new Error(EErrors.WEB3_INSTANCE);
    }
    if (!walletAddress) {
      throw new Error(EErrors.WALLET_ADDRESS);
    }

    const newSignature = await web3.eth.personal.sign(message, walletAddress, EMPTY);
    return newSignature;
  };

  /**
   * Dispatch new actions and update the context
   * @param {EActionTypes} type - The action to dispatch
   * @param {Web3} web3 - Web3 instance
   * @param {Web3["givenProvider"]} provider - provider instance
   * @param {string} walletAddress - user wallet address
   * @param {number} chainId - chain id
   * @param {boolean} isWalletConnected - is connected?
   */
  const dispatchAction = (
    type: EActionTypes,
    web3: Web3 | null,
    provider: Web3["givenProvider"],
    walletAddress: string,
    chainId: number,
    isWalletConnected: boolean
  ): void =>
    dispatch({
      type: type,
      payload: { web3, provider, walletAddress, chainId, isWalletConnected, config },
    });

  return {
    isWalletConnected,
    walletAddress,
    chainId,
    isInitialized,
    web3,
    connect,
    disconnect,
    signMessage,
  };
};

export default useWeb3;

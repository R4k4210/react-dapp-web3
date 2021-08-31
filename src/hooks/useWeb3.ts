import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { EActionTypes, EProvider } from "../enum/enums";
import { INFURA_ID } from "../env";
import { IUseWeb3 } from "../types/types";

const useWeb3 = (): IUseWeb3 => {
  const { state, dispatch } = useContext(Web3Context);
  const { walletAddress, web3, signature } = state;
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      let signatureStorage;

      try {
        signatureStorage = localStorage.getItem(EProvider.SIGNATURE) ?? "";

        if (signatureStorage !== "") {
          dispatchAction(
            EActionTypes.SIGN_MESSAGE,
            web3,
            walletAddress,
            signatureStorage
          );
        }
      } catch (error) {
        console.error("Unable to get signature from localStorage");
      }

      const metamaskStorage = localStorage.getItem(EProvider.METAMASK) ?? null;
      if (window.ethereum && metamaskStorage) {
        await instanceMetamask();
        return;
      }
      await instanceWalletConnect(true);
    };

    checkConnection();
  }, []);

  useEffect(() => {
    setIsWalletConnected(walletAddress ? true : false);
  }, [walletAddress]);

  const connect = async (): Promise<void> => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await instanceMetamask();
      return;
    }
    await instanceWalletConnect(false);
  };
  const disconnect = () => {
    localStorage.removeItem(EProvider.WALLETCONNECT);
    localStorage.removeItem(EProvider.METAMASK);
    localStorage.removeItem(EProvider.SIGNATURE);
    dispatchAction(EActionTypes.DISCONNECT, null, "", "");
  };

  const instanceMetamask = async () => {
    registerProviderEvents(window.ethereum);
    const web3: Web3 = setupWeb3(window.ethereum);
    const walletAddress = await getWalletAddress(web3);
    try {
      localStorage.setItem(EProvider.METAMASK, walletAddress);
    } catch (error) {
      return;
    }
    dispatchAction(EActionTypes.CONNECT, web3, walletAddress, "");
  };

  const instanceWalletConnect = async (justChecking: boolean) => {
    const provider = new WalletConnectProvider({
      infuraId: INFURA_ID,
    });
    try {
      const walletConnectStorage = localStorage.getItem(
        EProvider.WALLETCONNECT
      );
      if (walletConnectStorage || !justChecking) {
        await provider.request({ method: "eth_requestAccounts" });
      }
    } catch (error) {
      return;
    }
    registerProviderEvents(provider);
    const web3: Web3 = setupWeb3(provider);
    const walletAddress = await getWalletAddress(web3);
    dispatchAction(EActionTypes.CONNECT, web3, walletAddress, signature);
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!web3 || !walletAddress) {
      return "";
    }

    const newSignature = await web3?.eth.personal.sign(
      message,
      walletAddress,
      ""
    );
    localStorage.setItem(EProvider.SIGNATURE, newSignature ?? "");
    dispatchAction(
      EActionTypes.SIGN_MESSAGE,
      web3,
      walletAddress,
      newSignature
    );

    return newSignature;
  };

  const registerProviderEvents = (provider: Web3["givenProvider"]) => {
    provider.on("disconnect", () => {
      disconnect();
    });

    provider.on("accountsChanged", async () => {
      const web3: Web3 = new Web3(provider);
      const newWalletAddress = await getWalletAddress(web3);
      if (!newWalletAddress) {
        disconnect();
        return;
      }
      dispatchAction(
        EActionTypes.WALLET_CHANGED,
        web3,
        newWalletAddress,
        signature
      );
    });
  };

  const getWalletAddress = async (web3: Web3) => {
    return (await web3.eth.getAccounts())[0];
  };

  const setupWeb3 = (provider: Web3["givenProvider"]): Web3 => {
    return new Web3(provider);
  };

  const dispatchAction = (
    type: EActionTypes,
    web3: Web3 | null,
    walletAddress: string,
    signature: string
  ) => dispatch({ type: type, payload: { web3, walletAddress, signature } });

  return {
    isWalletConnected,
    walletAddress,
    signature,
    web3,
    connect,
    disconnect,
    signMessage,
  };
};

export default useWeb3;

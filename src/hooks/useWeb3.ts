import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { EActionTypes, EProvider, EProviderEvents } from "../enum/enums";
import { INFURA_ID } from "../env";
import { IUseWeb3 } from "../types/types";

const useWeb3 = (): IUseWeb3 => {
    const { state, dispatch } = useContext(Web3Context);
    const { walletAddress, web3, signature } = state;
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
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
        let signatureStorage;

        try {
            signatureStorage = localStorage.getItem(EProvider.SIGNATURE) ?? null;

            if (signatureStorage) {
                dispatchAction(EActionTypes.SIGN_MESSAGE, null, EProvider.NONE, signatureStorage, EProvider.NONE);
            }
        } catch (error) {
            console.error("Unable to get signature from localStorage", error);
        }
    }, [signature]);

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
        dispatchAction(EActionTypes.DISCONNECT, null, EProvider.NONE, EProvider.NONE, EProvider.NONE);
    };

    const instanceMetamask = async () => {
        registerProviderEvents(window.ethereum);
        const web3: Web3 = setupWeb3(window.ethereum);
        const walletAddress = await getWalletAddress(web3);

        if (!walletAddress) {
            dispatchAction(EActionTypes.BLOCK, null, EProvider.NONE, EProvider.NONE, EProvider.NONE);
            return;
        }

        dispatchAction(EActionTypes.CONNECT, web3, walletAddress, signature, EProvider.METAMASK);
    };

    const instanceWalletConnect = async (justChecking: boolean) => {
        const provider = new WalletConnectProvider({
            infuraId: INFURA_ID,
        });

        try {
            const walletConnectStorage = localStorage.getItem(EProvider.WALLETCONNECT);
            if (walletConnectStorage || !justChecking) {
                await provider.enable();
            }
        } catch (error) {
            console.error("Unable to get value from localStorage", error);
            return;
        }

        registerProviderEvents(provider);
        const web3: Web3 = setupWeb3(provider);
        const walletAddress = await getWalletAddress(web3);
        dispatchAction(EActionTypes.CONNECT, web3, walletAddress, signature, EProvider.WALLETCONNECT);
    };

    const signMessage = async (message: string): Promise<string> => {
        if (!web3 || !walletAddress) {
            return EProvider.NONE;
        }

        if (signature) {
            return signature;
        }

        const newSignature = await web3?.eth.personal.sign(message, walletAddress, EProvider.NONE);

        dispatchAction(EActionTypes.SIGN_MESSAGE, null, EProvider.NONE, newSignature, EProvider.NONE);

        return newSignature;
    };

    const registerProviderEvents = (web3Provider: Web3["givenProvider"]) => {
        web3Provider.on(EProviderEvents.DISCONNECT, () => {
            disconnect();
        });

        web3Provider.on(EProviderEvents.ACCOUNTS_CHANGED, async () => {
            const web3: Web3 = new Web3(web3Provider);
            const newWalletAddress = await getWalletAddress(web3);
            if (!newWalletAddress) {
                dispatchAction(EActionTypes.BLOCK, null, EProvider.NONE, EProvider.NONE, EProvider.NONE);
                return;
            }

            dispatchAction(
                EActionTypes.WALLET_CHANGED,
                null,
                newWalletAddress,
                EProvider.NONE,
                window.ethereum ? EProvider.METAMASK : EProvider.WALLETCONNECT
            );
        });

        web3Provider.on(EProviderEvents.CHAIN_CHANGED, () => {
            disconnect();
            window.location.reload();
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
        signature: string,
        walletProvider: string
    ) =>
        dispatch({
            type: type,
            payload: { web3, walletAddress, signature, walletProvider },
        });

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

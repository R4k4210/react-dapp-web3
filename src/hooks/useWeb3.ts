import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { EActionTypes, EErrors, EProvider, EProviderEvents } from "../enum/enums";
import { INFURA_ID } from "../env";
import { IUseWeb3 } from "../types/types";

const useWeb3 = (): IUseWeb3 => {
    const { state, dispatch } = useContext(Web3Context);
    const { walletAddress, web3 } = state;
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
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

    /**
     * Start connection with provider
     */
    const connect = async (): Promise<void> => {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            await instanceMetamask();
            return;
        }
        await instanceWalletConnect(false);
    };

    /**
     * This is a "fake" disconnect, cleans the contexts variables
     */
    const disconnect = () => {
        dispatchAction(EActionTypes.DISCONNECT, null, EProvider.NONE, EProvider.NONE);
    };

    /**
     * If Metamask is installed on browser, is used as a provider
     * Web3 is initialized as well
     */
    const instanceMetamask = async () => {
        const provider = window.ethereum;
        registerProviderEvents(provider);
        const web3: Web3 = setupWeb3(provider);
        const walletAddress = await getWalletAddress(web3);

        if (!walletAddress) {
            dispatchAction(EActionTypes.BLOCK, null, EProvider.NONE, EProvider.NONE);
            return;
        }

        dispatchAction(EActionTypes.CONNECT, web3, walletAddress, EProvider.METAMASK);
    };

    /**
     * Instance WalletConnect as a provider
     * @param {boolean} justChecking - Handle connection after reloading page
     */
    const instanceWalletConnect = async (justChecking: boolean) => {
        const provider = new WalletConnectProvider({
            infuraId: INFURA_ID,
        });
        registerProviderEvents(provider);
        const web3: Web3 = setupWeb3(provider);

        if (hasPermissionToConnect(web3)) {
            try {
                if (!justChecking) {
                    await provider.enable();
                }
            } catch (error) {
                console.error("Unable to get value from localStorage", error);
                return;
            }
        }

        const walletAddress = await getWalletAddress(web3);
        dispatchAction(EActionTypes.CONNECT, web3, walletAddress, EProvider.WALLETCONNECT);
    };

    const hasPermissionToConnect = (web3: Web3): boolean =>
        web3.currentProvider && (web3 as any)._provider.wc && (web3 as any)._provider.wc._accounts.length !== 0;

    const signMessage = async (message: string): Promise<string> => {
        if (!web3) {
            throw new Error(EErrors.WEB3_INSTANCE);
        }
        if (!walletAddress) {
            throw new Error(EErrors.WALLET_ADDRESS);
        }

        const newSignature = await web3?.eth.personal.sign(message, walletAddress, EProvider.NONE);
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
                dispatchAction(EActionTypes.BLOCK, null, EProvider.NONE, EProvider.NONE);
                return;
            }

            dispatchAction(
                EActionTypes.WALLET_CHANGED,
                null,
                newWalletAddress,
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

    const dispatchAction = (type: EActionTypes, web3: Web3 | null, walletAddress: string, walletProvider: string) =>
        dispatch({
            type: type,
            payload: { web3, walletAddress, walletProvider },
        });

    return {
        isWalletConnected,
        walletAddress,
        web3,
        connect,
        disconnect,
        signMessage,
    };
};

export default useWeb3;

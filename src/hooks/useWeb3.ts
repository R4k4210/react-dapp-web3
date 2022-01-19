import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { EActionTypes, EErrors, EMPTY, EProviderEvents } from "../enum/enums";
import { INFURA_ID } from "../env";
import { IUseWeb3 } from "../types/types";

const useWeb3 = (): IUseWeb3 => {
    const { state, dispatch } = useContext(Web3Context);
    const { walletAddress, web3, provider, chainId, isWalletConnected } = state;
    const [isInitialized, setIsInicialized] = useState(false);

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

    /**
     * Initialize connection with provider
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
     * Disconnect only works with WalletConnect.
     * The only way for Metamask disconnect is from browser extension
     */
    const disconnect = async (): Promise<void> => {
        if (window.ethereum) {
            console.error(EErrors.WC_DISCONNECT);
            return;
        }

        if (provider) {
            await provider.disconnect();
        }

        dispatchAction(EActionTypes.DISCONNECT, null, null, EMPTY, 0, false);
    };

    /**
     * If Metamask is installed on browser, it's used as a provider
     * Web3 is initialized as well
     * Instance walletAddress and chainId
     */
    const instanceMetamask = async (): Promise<void> => {
        const mkprovider = window.ethereum;
        registerProviderEvents(mkprovider);
        const web3: Web3 = setupWeb3(mkprovider);
        const walletAddress = await getWalletAddress(web3);
        const chainId = await getChainId(web3);

        if (!walletAddress) {
            dispatchAction(EActionTypes.BLOCK, null, null, EMPTY, 0, false);
            setIsInicialized(true);
            return;
        }

        dispatchAction(EActionTypes.CONNECT, web3, mkprovider, walletAddress, chainId, true);
        setIsInicialized(true);
    };

    /**
     * Instance WalletConnect as a provider, setup web3, walletAddress and chainId
     * @param {boolean} justChecking - Handle connection after reloading page
     */
    const instanceWalletConnect = async (checkingConnection: boolean): Promise<void> => {
        const wcprovider = new WalletConnectProvider({
            infuraId: INFURA_ID,
        });

        registerProviderEvents(wcprovider);
        const web3: Web3 = setupWeb3(wcprovider);
        let walletAddress = null;
        let chainId = 0;
        let isEnabled = false;

        if (checkingConnection && hasPermissionToConnect(web3)) {
            try {
                await wcprovider.enable();
                isEnabled = true;
            } catch (error) {
                console.error(error);
            }
        }

        if (!checkingConnection) {
            try {
                await wcprovider.enable();
                isEnabled = true;
            } catch (error) {
                console.error(error);
            }
        }

        if (isEnabled) {
            walletAddress = await getWalletAddress(web3);
            chainId = await getChainId(web3);
        }

        if (!walletAddress) {
            dispatchAction(EActionTypes.BLOCK, null, null, EMPTY, 0, false);
            setIsInicialized(true);
            return;
        }

        dispatchAction(EActionTypes.CONNECT, web3, wcprovider, walletAddress, chainId, true);
        setIsInicialized(true);
    };

    /**
     * Check if wallet has permission to connect without popping up modal
     * @param {Web3} web3 - Web3 instance
     * @return {boolean}
     */
    const hasPermissionToConnect = (web3: Web3): boolean =>
        web3.currentProvider && (web3 as any)._provider.wc && (web3 as any)._provider.wc._accounts.length !== 0;

    /**
     * Get the chaindId configured on wallet
     * @param {Web3} web3 - Web3 instance
     * @return {number} chainId
     */
    const getChainId = async (web3: Web3): Promise<number> => await web3.eth.getChainId();

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

        const newSignature = await web3?.eth.personal.sign(message, walletAddress, EMPTY);
        return newSignature;
    };

    /**
     * Register all provider event:
     * disconnect, accountsChanged and chainChanged (reload page if chainId changes)
     * @param {Web3["givenProvider"]} web3Provider - provider instace
     */
    const registerProviderEvents = (web3Provider: Web3["givenProvider"]) => {
        web3Provider.on(EProviderEvents.DISCONNECT, () => {
            disconnect();
        });

        web3Provider.on(EProviderEvents.ACCOUNTS_CHANGED, async () => {
            const web3: Web3 = new Web3(web3Provider);
            const newWalletAddress = await getWalletAddress(web3);
            if (!newWalletAddress) {
                dispatchAction(EActionTypes.BLOCK, null, null, EMPTY, 0, false);
                return;
            }

            dispatchAction(EActionTypes.WALLET_CHANGED, null, null, newWalletAddress, 0, false);
        });

        web3Provider.on(EProviderEvents.CHAIN_CHANGED, (chainId: string) => {
            const newChainId = parseInt(chainId, 16);
            dispatchAction(EActionTypes.CHAIN_CHANGED, null, null, EMPTY, newChainId, false);
        });
    };

    /**
     * Get selected wallet address
     * @param {Web3} web3 - Web3 instance
     * @return {Promise<string>} walletAddress
     */
    const getWalletAddress = async (web3: Web3): Promise<string> => (await web3.eth.getAccounts())[0];

    /**
     * Return the Web3 instance with the given provider
     * @param {Web3["givenProvider"]} web3Provider - provider instance
     * @return {Web3} Web3 instance
     */
    const setupWeb3 = (provider: Web3["givenProvider"]): Web3 => new Web3(provider);

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
            payload: { web3, provider, walletAddress, chainId, isWalletConnected },
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

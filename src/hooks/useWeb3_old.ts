import Web3 from "web3";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { EActionTypes, EErrors, EMPTY, EProviderEvents } from "../enum/enums";
import { IUseWeb3 } from "../types/types";
import MetaMask from "../wallets/MetaMask";
import WalletConnectV2 from "../wallets/WalletConnectV2";

const useWeb3 = (): IUseWeb3 => {
    const { state, dispatch } = useContext(Web3Context);
    const { walletAddress, web3, provider, chainId, isWalletConnected, config } = state;
    const [isInitialized, setIsInitialized] = useState(false);

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
        if (!provider || !web3) return;
        registerProviderEvents(provider);
    }, [provider, web3]);

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
     * Disconnect from provider. (MetaMask disconnect is not implemented)
     */
    const disconnect = async (): Promise<void> => {
        if (window.ethereum) {
            throw new Error(EErrors.METAMASK_DISCONNECT);
        }

        if (provider) {
            // await provider.disconnect();
        }

        dispatchAction(EActionTypes.DISCONNECT, null, null, EMPTY, 0, false);
    };

    /**
     * If Metamask is installed on browser, it's used as a provider
     * Web3 is initialized as well
     * Instance walletAddress and chainId
     */
    const instanceMetamask = async (): Promise<void> => {
        const provider = MetaMask().getProvider();
        const web3: Web3 = setupWeb3(provider);
        const walletAddress = await getWalletAddress(web3);
        const chainId = await getChainId(web3);

        if (!walletAddress) {
            dispatchAction(EActionTypes.BLOCK, null, null, EMPTY, 0, false);
            setIsInitialized(true);
            return;
        }

        dispatchAction(EActionTypes.CONNECT, web3, provider, walletAddress, chainId, true);
        setIsInitialized(true);
    };

    /**
     * Instance WalletConnect as a provider, setup web3, walletAddress and chainId
     * @param {boolean} checkingConnection - Handle connection after reloading page
     */
    const instanceWalletConnect = async (checkingConnection: boolean): Promise<void> => {
        if (!config?.walletConnectV2) {
            throw new Error(EErrors.WALLET_CONNECT_CONFIG);
        }

        const walletConnect = WalletConnectV2(config.walletConnectV2);
        const provider = await walletConnect.getProvider();
        const web3: Web3 = setupWeb3(provider);

        const isEnabled = await walletConnect.isEnabled();

        if (!checkingConnection && !isEnabled) {
            await provider.connect();
        }

        let walletAddress = null;
        let chainId = 0;

        if (await walletConnect.isEnabled()) {
            walletAddress = await getWalletAddress(web3);
            chainId = await getChainId(web3);
        }

        if (!walletAddress) {
            dispatchAction(EActionTypes.BLOCK, null, null, EMPTY, 0, false);
            setIsInitialized(true);
            return;
        }

        dispatchAction(EActionTypes.CONNECT, web3, provider, walletAddress, chainId, true);
        setIsInitialized(true);
    };

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
     * disconnect, accountsChanged and chainChanged
     * @param {Web3["givenProvider"]} provider - provider instace
     */
    const registerProviderEvents = (provider: Web3["givenProvider"]) => {
        provider.on(EProviderEvents.DISCONNECT, () => {
            disconnect();
        });

        provider.on(EProviderEvents.ACCOUNTS_CHANGED, async () => {
            let newWalletAddress = "";

            if (web3) {
                newWalletAddress = await getWalletAddress(web3);
                if (!newWalletAddress) {
                    dispatchAction(EActionTypes.BLOCK, null, null, EMPTY, 0, false);
                    return;
                }
            }

            dispatchAction(EActionTypes.WALLET_CHANGED, null, null, newWalletAddress, 0, false);
        });

        provider.on(EProviderEvents.CHAIN_CHANGED, (chainId: string) => {
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
     * @param {Web3["givenProvider"]} provider - provider instance
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

import { EErrors } from "../enum/enums";

declare global {
    interface Window {
        ethereum?: any;
    }
}

const MetaMask = () => {
    const getProvider = () => {
        const provider = window.ethereum;

        if (!provider) {
            return false;
        }

        if (provider.providers?.length) {
            const foundProvider = provider.providers.find((p: any) => p.isMetaMask);
            if (foundProvider) {
                return foundProvider;
            }
        }

        if (provider.isMetaMask) {
            return provider;
        }

        return false;
    };

    const registerEvents = (): void => {
        const provider = getProvider();
        // chain changed
        provider.on("chainChanged", () => { });
        // accounts changed
        provider.on("accountsChanged", () => { });
        // session disconnect
        provider.on("disconnect", () => { });
    };

    const isProviderAvailable = (): boolean => {
        return !!getProvider();
    };

    const isEnabled = async (): Promise<boolean> => {
        if (!isProviderAvailable()) {
            return false;
        }

        const provider = getProvider();
        const accounts = await provider.request({ method: "eth_accounts" });

        return accounts.length > 0;
    };

    const disconnect = async (): Promise<void> => {
        console.error(EErrors.METAMASK_DISCONNECT);
    };

    return { getProvider, disconnect, registerEvents, isEnabled };
};

export default MetaMask;

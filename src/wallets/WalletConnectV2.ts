import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { IWalletConnectV2 } from "../types/types";

const WalletConnectV2 = ({ chainIds, projectId }: IWalletConnectV2) => {
    const getProvider = async () => {
        if (!projectId) {
            throw new Error("Project Id missing for Wallet Connect V2");
        }

        if (!chainIds) {
            throw new Error("Chain Ids missing for Wallet Connect V2");
        }

        return await EthereumProvider.init({
            projectId,
            chains: chainIds as any,
            showQrModal: true,
        });
    };

    const isEnabled = async (): Promise<boolean> => {
        const provider = await getProvider();
        return provider.isWalletConnect && provider.connected && provider.accounts.length > 0;
    };

    const registerEvents = async () => {
        const provider = await getProvider();
        // chain changed
        provider.on("chainChanged", () => { });
        // accounts changed
        provider.on("accountsChanged", () => { });
        // session disconnect
        provider.on("disconnect", () => {
            console.log("wallet connect disconnected");
        });
    };

    const disconnect = async () => {
        console.log("wallet connect disconnected");
        const provider = await getProvider();
        return await provider.disconnect();
    };

    return { getProvider, isEnabled, registerEvents, disconnect };
};

export default WalletConnectV2;

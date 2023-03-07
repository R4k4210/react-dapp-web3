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
      chains: chainIds,
      methods: ["eth_sendTransaction", "personal_sign"],
    });
  };

  const isEnabled = async (): Promise<boolean> => {
    const provider = await getProvider();
    return provider.isWalletConnect && provider.connected && provider.accounts.length > 0;
  };

  return { getProvider, isEnabled };
};

export default WalletConnectV2;

import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { ICoinbase } from "../types/types";

const Coinbase = ({ darkMode = false, appName, appLogoUrl, chainId, jsonRPCUrl }: ICoinbase) => {
  const getProvider = () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: appName ?? "",
      appLogoUrl,
      darkMode,
    });

    return coinbaseWallet.makeWeb3Provider(jsonRPCUrl, chainId);
  };

  const registerEvents = (): void => {
    const provider = getProvider();
    // chain changed
    provider.on("chainChanged", () => { });
    // accounts changed
    provider.on("accountsChanged", () => { });
    // session disconnect
    provider.on("disconnect", () => {
      console.log("Coinbase disconnected");
    });
  };

  const isProviderAvailable = (): boolean => {
    return true;
  };

  const isEnabled = async (): Promise<boolean> => {
    const provider = getProvider();
    const accounts = (await provider.request({
      method: "eth_accounts",
    })) as string[];

    return accounts.length > 0;
  };

  const disconnect = () => {
    const provider = getProvider();
    provider.disconnect();
    provider.close();
  };

  return { getProvider, disconnect, registerEvents, isEnabled };
};

export default Coinbase;

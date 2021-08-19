import Web3 from "web3";
export interface IUseWeb3 {
    isWalletConnected: boolean;
    walletAddress: string;
    signature: string;
    web3: Web3 | null;
    connect: () => void;
    disconnect: () => void;
    signMessage: (message: string) => Promise<string>;
}
declare const useWeb3: () => IUseWeb3;
export default useWeb3;

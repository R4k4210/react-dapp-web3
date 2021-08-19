import { ComponentType, ReactElement } from "react";
import Web3 from "web3";
export declare type IWithWeb3 = {
    web3Data: {
        isWalletConnected: boolean;
        walletAddress: string;
        signature: string;
        web3: Web3 | null;
        connect: () => void;
        disconnect: () => void;
        signMessage: (message: string) => void;
    };
};
declare const withWeb3: <T extends IWithWeb3 = IWithWeb3>(WrappedComponent: ComponentType<T>) => (props: Omit<T, "web3Data">) => ReactElement;
export default withWeb3;

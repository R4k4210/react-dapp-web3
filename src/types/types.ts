import Web3 from "web3";
import { EActionTypes } from "../enum/enums";

export interface IUseWeb3 {
    isWalletConnected: boolean;
    isInitialized: boolean;
    walletAddress: string;
    chainId: number;
    web3: Web3 | null;
    connect: () => void;
    disconnect: () => void;
    signMessage: (message: string) => Promise<string>;
}

export type IWithWeb3 = {
    web3Data: {
        isWalletConnected: boolean;
        isInitialized: boolean;
        walletAddress: string;
        chainId: number;
        web3: Web3 | null;
        connect: () => void;
        disconnect: () => void;
        signMessage: (message: string) => Promise<string>;
    };
};

export interface IWeb3Context {
    web3: null | Web3;
    provider: null | Web3["givenProvider"];
    walletAddress: string;
    chainId: number;
    isWalletConnected: boolean;
}

export type TAction = {
    type: EActionTypes;
    payload: IWeb3Context;
};

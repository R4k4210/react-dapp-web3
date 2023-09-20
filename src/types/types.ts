import Web3 from "web3";
import { ReactElement, ReactNode } from "react";
import { EActionTypes, EWalletProviders } from "../enum/enums";

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

export interface IWeb3Context {
    web3: null | Web3;
    provider: /* null | Web3["givenProvider"] */ EWalletProviders | null;
    walletAddress: string;
    chainId: number;
    isWalletConnected: boolean;
    config: TProvidersConfig | null;
}

export interface IWeb3ContextProvider {
    config: TProvidersConfig;
    children: ReactNode | ReactElement | JSX.Element;
}

export type TProvidersConfig = {
    walletConnectV2: IWalletConnectV2;
    coinbase?: ICoinbase;
};

export interface IWalletConnectV2 {
    projectId?: string;
    chainIds?: number[];
}

export interface ICoinbase {
    darkMode?: boolean;
    appName?: string;
    appLogoUrl?: string;
    chainId: number;
    jsonRPCUrl: string;
}

export type TAction = {
    type: EActionTypes;
    payload: IWeb3Context;
};

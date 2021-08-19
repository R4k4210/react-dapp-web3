import { Dispatch, ReactNode } from "react";
import Web3 from "web3";
declare global {
    interface Window {
        ethereum: any;
    }
}
interface IWeb3Context {
    web3: null | Web3;
    walletAddress: string;
    signature: string;
}
export declare enum EActionTypes {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    WALLET_CHANGED = "WALLET_CHANGED",
    SIGN_MESSAGE = "SIGN_MESSAGE"
}
export declare type TAction = {
    type: EActionTypes;
    payload: IWeb3Context;
};
export declare const Web3Context: import("react").Context<{
    state: IWeb3Context;
    dispatch: Dispatch<TAction>;
}>;
export declare const Web3ContextProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export {};

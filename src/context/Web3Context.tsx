import { createContext, Dispatch, ReactNode, useReducer } from "react";
import Web3 from "web3";

/* eslint-disable @typescript-eslint/no-explicit-any*/
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

export enum EActionTypes {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    WALLET_CHANGED = "WALLET_CHANGED",
    SIGN_MESSAGE = "SIGN_MESSAGE",
}

export type TAction = {
    type: EActionTypes;
    payload: IWeb3Context;
};

const initialState: IWeb3Context = {
    web3: null,
    walletAddress: "",
    signature: "",
};

export const Web3Context = createContext<{ state: IWeb3Context; dispatch: Dispatch<TAction> }>({
    state: initialState,
    dispatch: () => null,
});

const web3Reducer = (state: IWeb3Context, action: TAction): IWeb3Context => {
    const {
        type,
        payload: { web3, walletAddress, signature },
    } = action;

    switch (type) {
        case "CONNECT":
            return {
                ...state,
                web3,
                walletAddress,
            };
        case "DISCONNECT":
            return initialState;
        case "WALLET_CHANGED":
            return {
                ...state,
                walletAddress,
            };
        case "SIGN_MESSAGE":
            return {
                ...state,
                signature,
            };
        default:
            return state;
    }
};

export const Web3ContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [state, dispatch] = useReducer(web3Reducer, initialState);

    return <Web3Context.Provider value={{ state, dispatch }}>{children}</Web3Context.Provider>;
};

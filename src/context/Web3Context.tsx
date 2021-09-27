import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { IWeb3Context, TAction } from "../types/types";
import { EActionTypes, EProvider } from "../enum/enums";

declare global {
    interface Window {
        ethereum: any;
    }
}

const initialState: IWeb3Context = {
    web3: null,
    walletAddress: EProvider.NONE,
};

export const Web3Context = createContext<{
    state: IWeb3Context;
    dispatch: Dispatch<TAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

const web3Reducer = (state: IWeb3Context, action: TAction): IWeb3Context => {
    const {
        type,
        payload: { web3, walletAddress },
    } = action;

    switch (type) {
        case EActionTypes.CONNECT:
            return {
                ...state,
                web3,
                walletAddress,
            };
        case EActionTypes.WALLET_CHANGED:
            return {
                ...state,
                walletAddress,
            };
        case EActionTypes.BLOCK:
            return initialState;
        case EActionTypes.DISCONNECT:
            return initialState;
        default:
            return state;
    }
};

export const Web3ContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [state, dispatch] = useReducer(web3Reducer, initialState);

    return <Web3Context.Provider value={{ state, dispatch }}>{children}</Web3Context.Provider>;
};

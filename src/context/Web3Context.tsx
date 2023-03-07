import { createContext, Dispatch, useReducer } from "react";
import { IWeb3Context, IWeb3ContextProvider, TAction } from "../types/types";
import { EActionTypes, EMPTY } from "../enum/enums";

const initialState: IWeb3Context = {
    web3: null,
    provider: null,
    walletAddress: EMPTY,
    chainId: 0,
    isWalletConnected: false,
    config: null,
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
        payload: { web3, provider, walletAddress, chainId, isWalletConnected },
    } = action;

    switch (type) {
        case EActionTypes.CONNECT:
            return {
                ...state,
                web3,
                provider,
                walletAddress,
                chainId,
                isWalletConnected,
            };
        case EActionTypes.WALLET_CHANGED:
            return {
                ...state,
                walletAddress,
            };
        case EActionTypes.CHAIN_CHANGED:
            return {
                ...state,
                chainId,
            };
        case EActionTypes.BLOCK:
            return initialState;
        case EActionTypes.DISCONNECT:
            return initialState;
        default:
            return state;
    }
};

export const Web3ContextProvider = ({ children, config }: IWeb3ContextProvider): JSX.Element => {
    initialState.config = config;

    const [state, dispatch] = useReducer(web3Reducer, initialState);

    return <Web3Context.Provider value={{ state, dispatch }}>{children}</Web3Context.Provider>;
};

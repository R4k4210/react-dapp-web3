import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { IWeb3Context, TAction } from "../types/types";
import { EActionTypes } from "../enum/enums";

/* eslint-disable @typescript-eslint/no-explicit-any*/
declare global {
  interface Window {
    ethereum: any;
  }
}

const initialState: IWeb3Context = {
  web3: null,
  walletAddress: "",
  signature: "",
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
    payload: { web3, walletAddress, signature },
  } = action;

  switch (type) {
    case EActionTypes.CONNECT:
      return {
        ...state,
        web3,
        walletAddress,
      };
    case EActionTypes.DISCONNECT:
      return initialState;
    case EActionTypes.WALLET_CHANGED:
      return {
        ...state,
        walletAddress,
      };
    case EActionTypes.SIGN_MESSAGE:
      return {
        ...state,
        signature,
      };
    default:
      return state;
  }
};

export const Web3ContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  return (
    <Web3Context.Provider value={{ state, dispatch }}>
      {children}
    </Web3Context.Provider>
  );
};

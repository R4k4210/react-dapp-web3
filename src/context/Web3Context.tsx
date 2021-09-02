import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { IWeb3Context, TAction } from "../types/types";
import { EActionTypes, EProvider } from "../enum/enums";

/* eslint-disable @typescript-eslint/no-explicit-any*/
declare global {
  interface Window {
    ethereum: any;
  }
}

const initialState: IWeb3Context = {
  web3: null,
  walletAddress: EProvider.NONE,
  signature: EProvider.NONE,
  walletProvider: EProvider.NONE,
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
    payload: { web3, walletAddress, signature, walletProvider },
  } = action;

  switch (type) {
    case EActionTypes.CONNECT:
      setLocalStorage(walletProvider, walletAddress);
      return {
        ...state,
        web3,
        walletAddress,
        signature,
        walletProvider,
      };
    case EActionTypes.WALLET_CHANGED:
      cleanSignature();
      setLocalStorage(walletProvider, walletAddress);
      return {
        ...state,
        walletAddress,
        signature,
        walletProvider,
      };
    case EActionTypes.SIGN_MESSAGE:
      setLocalStorage(EProvider.SIGNATURE, signature);
      return {
        ...state,
        signature,
      };
    case EActionTypes.BLOCK:
      return initialState;
    case EActionTypes.DISCONNECT:
      cleanLocalStorage();
      cleanSignature();
      return initialState;
    default:
      return state;
  }
};

const cleanLocalStorage = () => {
  try {
    localStorage.removeItem(EProvider.METAMASK);
    localStorage.removeItem(EProvider.WALLETCONNECT);
  } catch (error) {
    console.error("Error trying to clean localStorage", error);
  }
};

const cleanSignature = () => {
  try {
    localStorage.removeItem(EProvider.SIGNATURE);
  } catch (error) {
    console.error("Error trying to remove localStorage value");
  }
};

const setLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Error setting localStorage value", error);
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

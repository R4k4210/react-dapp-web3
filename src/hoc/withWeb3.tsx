import { ComponentType, ReactElement } from "react";
import useWeb3 from "../hooks/useWeb3";
import Web3 from "web3";

export interface IWithWeb3 {
  web3Data: {
    isWalletConnected: boolean;
    walletAddress: string;
    signature: string;
    web3: Web3 | null;
    connect: () => void;
    disconnect: () => void;
    signMessage: (message: string) => void;
  };
}

const withWeb3 =
  <T extends IWithWeb3 = IWithWeb3>(WrappedComponent: ComponentType<T>) =>
  (props: Omit<T, keyof IWithWeb3>): ReactElement => {
    const {
      isWalletConnected,
      walletAddress,
      signature,
      web3,
      connect,
      disconnect,
      signMessage,
    } = useWeb3();

    const displayName =
      WrappedComponent.displayName || WrappedComponent.name || "Component";
    WrappedComponent.displayName = `WithWeb3(${displayName})`;

    return (
      <WrappedComponent
        {...(props as T)}
        web3Data={{
          isWalletConnected,
          walletAddress,
          signature,
          web3,
          connect,
          disconnect,
          signMessage,
        }}
        as
        IWithWeb3
      />
    );
  };

export default withWeb3;

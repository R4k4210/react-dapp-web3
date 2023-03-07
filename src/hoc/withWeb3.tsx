import { ComponentType } from "react";
import { IWithWeb3 } from "../types/types";
import useWeb3 from "../hooks/useWeb3";

const withWeb3 =
    <T extends IWithWeb3>(WrappedComponent: ComponentType<T>) =>
    (props: Omit<T, keyof IWithWeb3>) => {
        const { isWalletConnected, isInitialized, walletAddress, chainId, web3, connect, disconnect, signMessage } =
            useWeb3();

        const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
        WrappedComponent.displayName = `WithWeb3(${displayName})`;

        return (
            <WrappedComponent
                {...(props as T)}
                web3Data={{
                    isWalletConnected,
                    isInitialized,
                    walletAddress,
                    chainId,
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

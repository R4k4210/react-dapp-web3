import useWeb3 from "../hooks";

const TestComponent = () => {
    const { isWalletConnected, walletAddress, signature, connect, disconnect, signMessage } = useWeb3();

    return (
        <div>
            <span id="wallet-address">{walletAddress}</span>
            <span id="signature">{signature}</span>
            <span id="is-connected">{isWalletConnected}</span>
        </div>
    );
};

export default TestComponent;

import { renderHook, act } from "@testing-library/react-hooks";
import ShallowRenderer from "react-test-renderer/shallow";
import withWeb3 from "../hoc";
import useWeb3 from "../hooks";
import Web3 from "web3";
import { Web3ContextProvider } from "../context/Web3Context";
import { ReactNode } from "react";
jest.mock("web3");

const WALLET_ADDRESS = "0xTest";
const SIGNED_MESSAGE = "signedMessage";

const window_ethereum: any = {
    isMetaMask: true,
    request: async (request: { method: string; params?: Array<unknown> }) => {
        if (["eth_accounts", "eth_requestAccounts"].includes(request.method)) {
            return [WALLET_ADDRESS];
        } else if (["personal_sign"].includes(request.method)) {
            return SIGNED_MESSAGE;
        }

        throw Error(`Unknown request: ${request.method}`);
    },
    on: jest.fn(),
};

//Run command: NODE_OPTIONS=--unhandled-rejections=warn yarn test
beforeEach(() => {
    jest.resetModules();
    window.ethereum = null;
});

describe("Render a component with props added by HOC", () => {
    test("should add web3Data prop to wrapped component", () => {
        const mockedComponent = jest.fn(() => null);
        const WrappedComponent = withWeb3(mockedComponent);
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<WrappedComponent />, Web3ContextProvider);
        const result = renderer.getRenderOutput();
        expect(result.props.web3Data).toBeDefined();
        expect(result.props.web3Data.isWalletConnected).toBeFalsy();
        expect(result.props.web3Data.isInitialized).toBeFalsy();
        expect(result.props.web3Data.walletAddress).toBe("");
        expect(result.props.web3Data.web3).toBeNull();
        expect(result.props.web3Data.connect).toBeInstanceOf(Function);
        expect(result.props.web3Data.disconnect).toBeInstanceOf(Function);
        expect(result.props.web3Data.signMessage).toBeInstanceOf(Function);
    });
});

describe("useWeb3 custom hook", () => {
    test("should call connect correctly", async () => {
        window.ethereum = window_ethereum;

        const wrapper = ({ children }: { children: ReactNode }) => (
            <Web3ContextProvider>{children}</Web3ContextProvider>
        );

        const { result } = renderHook(() => useWeb3(), { wrapper });

        await act(async () => {
            result.current.connect();
        });

        expect(result.current.walletAddress).toBe(WALLET_ADDRESS);
        expect(result.current.web3).toBeDefined();
        expect(result.current.chainId).toBe(1);
        expect(result.current.isInitialized).toBeTruthy();
        expect(result.current.isWalletConnected).toBeTruthy();
    });

    test("should sign message correctly", async () => {
        window.ethereum = window_ethereum;

        const wrapper = ({ children }: { children: ReactNode }) => (
            <Web3ContextProvider>{children}</Web3ContextProvider>
        );

        const { result } = renderHook(() => useWeb3(), { wrapper });

        let signedMessage;
        await act(async () => {
            await result.current.connect();
            signedMessage = await result.current.signMessage("message");
        });

        expect(signedMessage).toBe(SIGNED_MESSAGE);
    });
});

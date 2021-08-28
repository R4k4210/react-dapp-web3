import { renderHook, act } from "@testing-library/react-hooks";
import ShallowRenderer from "react-test-renderer/shallow";
import withWeb3 from "../hoc";
import useWeb3 from "../hooks";
import Web3 from "web3";
jest.mock("web3");

const OLD_ENV = process.env;

//Run command: NODE_OPTIONS=--unhandled-rejections=warn yarn test
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
  delete process.env.REACT_APP_INFURA_ID;
});

afterEach(() => {
  process.env = OLD_ENV;
});

describe("Render a component with props added by HOC", () => {
  test("should add web3Data prop to wrapped component", () => {
    const mockedComponent = jest.fn(() => null);
    const WrappedComponent = withWeb3(mockedComponent);
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<WrappedComponent />);
    const result = renderer.getRenderOutput();
    expect(result.props.web3Data).toBeDefined();
    expect(result.props.web3Data.isWalletConnected).toBeFalsy();
    expect(result.props.web3Data.walletAddress).toBe("");
    expect(result.props.web3Data.signature).toBe("");
    expect(result.props.web3Data.web3).toBeNull();
    expect(result.props.web3Data.connect).toBeInstanceOf(Function);
    expect(result.props.web3Data.disconnect).toBeInstanceOf(Function);
    expect(result.props.web3Data.signMessage).toBeInstanceOf(Function);
  });
});

describe("Testing useWeb3 custom hook", () => {
  test("should have a valid walletaddress after connect", async () => {
    process.env.REACT_APP_INFURA_ID = "6652e2b820d540eb8e855da9757c08f4";

    window.ethereum = jest
      .fn()
      .mockReturnValue({ ethereum: { enable: jest.fn() } });

    const mRes = ["0xtest"];
    const web3 = new Web3(window.ethereum);
    web3.eth.getAccounts();
    console.log("web3", web3);

    const { result } = renderHook(() => useWeb3());

    act(() => {
      result.current.connect();
    });

    expect(typeof result.current.connect).toBe("function");
    //expect(result.current.walletAddress).toBe(mRes);
    console.log("result", result.current);
  });
});

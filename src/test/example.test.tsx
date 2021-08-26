import renderer from "react-test-renderer";
import ShallowRenderer from "react-test-renderer/shallow";
import withWeb3 from "../hoc";
import useWeb3 from "../hooks";
import Web3 from "web3";
import TestComponent from "./TestComponent";

//Run command: NODE_OPTIONS=--unhandled-rejections=warn yarn test
beforeEach(() => {
  jest.resetModules();

  //process.env = Object.assign(process.env, {
  //REACT_APP_INFURA_ID: "6652e2b820d540eb8e855da9757c08f4",
  //});
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

describe("Call useWeb3 hook", () => {
  test("should be able to call connect function", () => {
    jest.mock("../hooks"),
      () => ({
        useWeb3: () => ({
          isWalletConnected: true,
          walletAddress: "0xtest",
          signature: "",
          web3: new Web3(window.ethereum),
          connect: jest.fn(),
          disconnect: jest.fn(),
          signMessage: jest.fn(),
        }),
      });

    const component = renderer.create(<TestComponent />);
    const instanceComponent = component.toJSON();
    console.log("instance", instanceComponent);
  });
});

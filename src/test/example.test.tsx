import withWeb3 from "../hoc";

beforeEach(() => {
  jest.resetModules();
  process.env = Object.assign(process.env, {
    REACT_APP_INFURA_ID: "6652e2b820d540eb8e855da9757c08f4",
  });
});

//Run command: NODE_OPTIONS=--unhandled-rejections=warn yarn test

describe("Render a components with hoc props", () => {
  test("should add web3Data prop to wrapped component", () => {
    const mockedComponent = jest.fn(() => null);
    const WrappedComponent = withWeb3(mockedComponent);
  });
});

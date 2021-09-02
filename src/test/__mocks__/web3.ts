/* Mock web3 as __tests__/__mocks__/web3.js */
// const web3 = jest.genMockFromModule('web3')

/* Mock web3-eth-contract */
let mockWeb3EthContract = function () {};

function __setMockContract(mock: any) {
    mockWeb3EthContract = mock;
}

let blockNumber = 0;
function __setBlockNumber(number: number) {
    blockNumber = number;
}

const eth = {
    Contract: jest.fn().mockImplementation(() => mockWeb3EthContract),
    getBlockNumber: () => blockNumber,
    getAccounts: jest.fn().mockReturnValue(["0xtest"]),
};

const web3 = function (provider: any) {
    return {
        provider: provider,
        eth: eth,
    };
};

module.exports = web3;

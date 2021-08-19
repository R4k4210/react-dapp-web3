import { jsx } from 'react/jsx-runtime';
import { createContext, useReducer, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var EActionTypes;
(function (EActionTypes) {
    EActionTypes["CONNECT"] = "CONNECT";
    EActionTypes["DISCONNECT"] = "DISCONNECT";
    EActionTypes["WALLET_CHANGED"] = "WALLET_CHANGED";
    EActionTypes["SIGN_MESSAGE"] = "SIGN_MESSAGE";
})(EActionTypes || (EActionTypes = {}));
var initialState = {
    web3: null,
    walletAddress: "",
    signature: "",
};
var Web3Context = createContext({
    state: initialState,
    dispatch: function () { return null; },
});
var web3Reducer = function (state, action) {
    var type = action.type, _a = action.payload, web3 = _a.web3, walletAddress = _a.walletAddress, signature = _a.signature;
    switch (type) {
        case "CONNECT":
            return __assign(__assign({}, state), { web3: web3, walletAddress: walletAddress });
        case "DISCONNECT":
            return initialState;
        case "WALLET_CHANGED":
            return __assign(__assign({}, state), { walletAddress: walletAddress });
        case "SIGN_MESSAGE":
            return __assign(__assign({}, state), { signature: signature });
        default:
            return state;
    }
};
var Web3ContextProvider = function (_a) {
    var children = _a.children;
    var _b = useReducer(web3Reducer, initialState), state = _b[0], dispatch = _b[1];
    return jsx(Web3Context.Provider, __assign({ value: { state: state, dispatch: dispatch } }, { children: children }), void 0);
};

var EProvider;
(function (EProvider) {
    EProvider["METAMASK"] = "metamask";
    EProvider["WALLETCONNECT"] = "walletconnect";
})(EProvider || (EProvider = {}));
var SIGNATURE = "signature";
var useWeb3 = function () {
    var _a = useContext(Web3Context), state = _a.state, dispatch = _a.dispatch;
    var walletAddress = state.walletAddress, web3 = state.web3, signature = state.signature;
    var _b = useState(false), isWalletConnected = _b[0], setIsWalletConnected = _b[1];
    useEffect(function () {
        var checkConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
            var signatureStorage, metamaskStorage;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        try {
                            signatureStorage = (_a = localStorage.getItem(SIGNATURE)) !== null && _a !== void 0 ? _a : "";
                            if (signatureStorage !== "") {
                                dispatchAction(EActionTypes.SIGN_MESSAGE, web3, walletAddress, signatureStorage);
                            }
                        }
                        catch (error) {
                            console.error("Unable to get signature from localStorage");
                        }
                        metamaskStorage = (_b = localStorage.getItem(EProvider.METAMASK)) !== null && _b !== void 0 ? _b : null;
                        if (!(window.ethereum && metamaskStorage)) return [3 /*break*/, 2];
                        return [4 /*yield*/, instanceMetamask()];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, instanceWalletConnect(true)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        checkConnection();
    }, []);
    useEffect(function () {
        setIsWalletConnected(walletAddress ? true : false);
    }, [walletAddress]);
    var connect = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.ethereum) return [3 /*break*/, 3];
                    return [4 /*yield*/, window.ethereum.enable()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, instanceMetamask()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, instanceWalletConnect(false)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var disconnect = function () {
        localStorage.removeItem(EProvider.WALLETCONNECT);
        localStorage.removeItem(EProvider.METAMASK);
        localStorage.removeItem(SIGNATURE);
        dispatchAction(EActionTypes.DISCONNECT, null, "", "");
    };
    var instanceMetamask = function () { return __awaiter(void 0, void 0, void 0, function () {
        var web3, walletAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    registerProviderEvents(window.ethereum);
                    web3 = setupWeb3(window.ethereum);
                    return [4 /*yield*/, getWalletAddress(web3)];
                case 1:
                    walletAddress = _a.sent();
                    try {
                        localStorage.setItem(EProvider.METAMASK, walletAddress);
                    }
                    catch (error) {
                        return [2 /*return*/];
                    }
                    dispatchAction(EActionTypes.CONNECT, web3, walletAddress, "");
                    return [2 /*return*/];
            }
        });
    }); };
    var instanceWalletConnect = function (justChecking) { return __awaiter(void 0, void 0, void 0, function () {
        var provider, walletConnectStorage, web3, walletAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = new WalletConnectProvider({
                        infuraId: "6652e2b820d540eb8e855da9757c08f4",
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    walletConnectStorage = localStorage.getItem(EProvider.WALLETCONNECT);
                    if (!(walletConnectStorage || !justChecking)) return [3 /*break*/, 3];
                    return [4 /*yield*/, provider.enable()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
                case 5:
                    registerProviderEvents(provider);
                    web3 = setupWeb3(provider);
                    return [4 /*yield*/, getWalletAddress(web3)];
                case 6:
                    walletAddress = _a.sent();
                    dispatchAction(EActionTypes.CONNECT, web3, walletAddress, signature);
                    return [2 /*return*/];
            }
        });
    }); };
    var signMessage = function (message) { return __awaiter(void 0, void 0, void 0, function () {
        var newSignature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!web3 || !walletAddress) {
                        return [2 /*return*/, ""];
                    }
                    return [4 /*yield*/, (web3 === null || web3 === void 0 ? void 0 : web3.eth.personal.sign(message, walletAddress, ""))];
                case 1:
                    newSignature = _a.sent();
                    localStorage.setItem(SIGNATURE, newSignature !== null && newSignature !== void 0 ? newSignature : "");
                    dispatchAction(EActionTypes.SIGN_MESSAGE, web3, walletAddress, newSignature);
                    return [2 /*return*/, newSignature];
            }
        });
    }); };
    var registerProviderEvents = function (provider) {
        provider.on("disconnect", function () {
            disconnect();
        });
        provider.on("accountsChanged", function () { return __awaiter(void 0, void 0, void 0, function () {
            var web3, newWalletAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        web3 = new Web3(provider);
                        return [4 /*yield*/, getWalletAddress(web3)];
                    case 1:
                        newWalletAddress = _a.sent();
                        if (!newWalletAddress) {
                            disconnect();
                            return [2 /*return*/];
                        }
                        dispatchAction(EActionTypes.WALLET_CHANGED, web3, newWalletAddress, signature);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    var getWalletAddress = function (web3) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getAccounts()];
                case 1: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    }); };
    var setupWeb3 = function (provider) {
        return new Web3(provider);
    };
    var dispatchAction = function (type, web3, walletAddress, signature) { return dispatch({ type: type, payload: { web3: web3, walletAddress: walletAddress, signature: signature } }); };
    return {
        isWalletConnected: isWalletConnected,
        walletAddress: walletAddress,
        signature: signature,
        web3: web3,
        connect: connect,
        disconnect: disconnect,
        signMessage: signMessage,
    };
};

var withWeb3 = function (WrappedComponent) {
    return function (props) {
        var _a = useWeb3(), isWalletConnected = _a.isWalletConnected, walletAddress = _a.walletAddress, signature = _a.signature, web3 = _a.web3, connect = _a.connect, disconnect = _a.disconnect, signMessage = _a.signMessage;
        var displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
        WrappedComponent.displayName = "WithWeb3(" + displayName + ")";
        return (jsx(WrappedComponent, __assign({}, props, { web3Data: {
                isWalletConnected: isWalletConnected,
                walletAddress: walletAddress,
                signature: signature,
                web3: web3,
                connect: connect,
                disconnect: disconnect,
                signMessage: signMessage,
            }, as: true, IWithWeb3: true }), void 0));
    };
};

export { EActionTypes, Web3Context, Web3ContextProvider, useWeb3, withWeb3 };

declare global {
  interface Window {
    ethereum?: any;
  }
}

const MetaMask = () => {
  const getProvider = () => {
    const provider = window.ethereum;

    if (!provider) {
      return false;
    }

    if (provider.providers?.length) {
      const foundProvider = provider.providers.find((p: any) => p.isMetaMask);
      if (foundProvider) {
        return foundProvider;
      }
    }

    if (provider.isMetaMask) {
      return provider;
    }

    return false;
  };

  return { getProvider };
};

export default MetaMask;

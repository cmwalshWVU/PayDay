import WalletConnectProvider from "@walletconnect/web3-provider"
import Web3Modal from 'web3modal'
import Fortmatic from "fortmatic"

const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "fe144c9b7ccd44fc9f4ef53807df0bc5" // required
      }
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "pk_live_633916DC39808625" // required
      }
    }
};

const WalletConnector = new Web3Modal({
    network: "mainnet", // optional
    // cacheProvider: true, // optional
    theme: "dark",
    providerOptions // required
});

export default WalletConnector
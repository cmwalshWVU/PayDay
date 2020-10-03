import WalletConnectProvider from "@walletconnect/web3-provider"
import Web3Modal from 'web3modal'
import Fortmatic from "fortmatic"
import Portis from "@portis/web3";

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
    },
    portis: {
        package: Portis, // required
        options: {
          id: "03f7a85e-c77c-42d0-b307-ff74a0ef6ae6" // required
        }
      }
};

const WalletConnector = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    theme: "dark",
    providerOptions // required
});

const initData = {
    user: null,
    useDarkMode: true,
    portis: undefined,
    fortmatic: undefined,
    contacts: [],
    walletConnector: WalletConnector,
    loadingBalances: false,
    web3: null
}

const userReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'SET_USER':
        return {
            ...state,
            user: action.user
        }
    case 'SET_THEME':
        return {
            ...state,
            useDarkMode: action.useDarkMode
        }
    case 'SET_PORTIS':
        return {
            ...state,
            portis: action.portis
        }
    case 'SET_WEB3':
        return {
            ...state,
            web3: action.web3
        }
    case 'SET_FORTMATIC':
        return {
            ...state,
            fortmatic: action.fortmatic
        }
    case 'SET_CONTACTS':
        return {
            ...state,
            contacts: action.contacts
        }
    case 'SET_LOADING_BALANCES':
        return {
            ...state,
            loadingBalances: action.loadingBalances
        }
    default:
        return {
            ...state
        }
    }
}

export default userReducer;
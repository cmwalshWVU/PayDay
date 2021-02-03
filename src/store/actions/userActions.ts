export const setUser = (user: any) => {
    return { type: 'SET_USER', user}
};

export function setUseDarkMode(useDarkMode: boolean) {
    return {
        type: 'SET_THEME',
        useDarkMode
    }
}

export function setLoadingBalances(loadingBalances: any) {
    return {
        type: 'SET_LOADING_BALANCES',
        loadingBalances
    }
}

export function setWeb3(web3: any) {
    return {
        type: 'SET_WEB3',
        web3
    }
}

export function setContacts(contacts: any) {
    return {
        type: 'SET_CONTACTS',
        contacts
    }
}

export function setAccounts(accounts: any) {
    return {
        type: 'SET_ACCOUNTS',
        accounts
    }
}

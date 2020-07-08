export const setUser = (user: any) => {
    return { type: 'SET_USER', user}
};

export function setUseDarkMode(useDarkMode: boolean) {
    return {
        type: 'SET_THEME',
        useDarkMode
    }
}

export function setPortis(portis: any) {
    return {
        type: 'SET_PORTIS',
        portis
    }
}

export function setFortmatic(fortmatic: any) {
    return {
        type: 'SET_FORTMATIC',
        fortmatic
    }
}

export function setWeb3(web3: any) {
    return {
        type: 'SET_WEB3',
        web3
    }
}
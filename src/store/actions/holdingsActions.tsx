
export function setHoldings(holdings: any) {
    return {
        type: 'UPDATE_CURRENT_HOLDINGS',
        holdings
    }
}

export function setEthHoldings(ethHoldings: any, ethBalance: any) {
    return {
        type: 'UPDATE_CURRENT_ETH_HOLDINGS',
        ethHoldings,
        ethBalance
    }
}

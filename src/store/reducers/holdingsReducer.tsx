const initData = {
    holdings: [],
    ethHoldings: "0",
    ethBalance: 0
}

const holdingsReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'UPDATE_CURRENT_HOLDINGS':
        return {
            ...state,
            holdings: action.holdings
        }
    case 'UPDATE_CURRENT_ETH_HOLDINGS':
        return {
            ...state,
            ethHoldings: action.ethHoldings,
            ethBalance: action.ethBalance
        }
    default:
        return {
            ...state
        }
    }
}

export default holdingsReducer;
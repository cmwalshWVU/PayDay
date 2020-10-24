const initData = {
    holdings: [],
    ethHoldings: "0",
    ethBalance: 0,
    series: [],
    labels: []
}

const holdingsReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'UPDATE_CURRENT_HOLDINGS':
        return {
            ...state,
            holdings: action.holdings
        }
    case 'UPDATE_PIE_CHART':
        return {
            ...state,
            series: action.series,
            labels: action.labels
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
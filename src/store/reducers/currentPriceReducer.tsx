import moment from "moment";

const initData = {
    currentPrices: [],
    lastUpdated: moment()
}

const currentPriceReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'UPDATE_CURRENT_PRICES':
        return {
            ...state,
            currentPrices: action.prices,
            lastUpdated: moment()
        }
    default:
        return {
            ...state
        }
    }
}

export default currentPriceReducer;
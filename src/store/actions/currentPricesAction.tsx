import axios from 'axios';

export function getCurrentPrices() {
    return(dispatch: any) =>{
        axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false")
        .then(response => {
            dispatch(updateCurrentPrices(response.data))
        })
        .catch(err => console.log(err));
    }
};

export function updateCurrentPrices(prices: any) {
    return {
        type: 'UPDATE_CURRENT_PRICES',
        prices: prices
    }
}

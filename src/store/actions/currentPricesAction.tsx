import axios from 'axios';
import { isPlatform } from '@ionic/core';

const getPricesByPage = (page: any = 1, prices: any = []): any => {
  const maxPage = isPlatform("mobile") ? 3 : 5
  return axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`)
  .then(res => {
    if (res.data.length > 0 && page < maxPage) {
        return getPricesByPage(
            page+1,
            prices.concat(res.data)
          );
    } else {
        return prices
    }
  }).catch(e => {
    if (e.response.status === 404) {
      console.log('LAST PAGE REACHED')
      return prices
    } else
      return e
  });
}

export function getCurrentPrices() {
    return(dispatch: any) => {
        getPricesByPage()
            .then((prices: any) =>
                dispatch(updateCurrentPrices(prices))
            ).catch((err: any) =>
                console.log(err)
            );
    }
};

export function updateCurrentPrices(prices: any) {
    return {
        type: 'UPDATE_CURRENT_PRICES',
        prices: prices
    }
}

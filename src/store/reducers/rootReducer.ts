import { combineReducers } from "redux";
import userReducer from "./userReducer";
import newsReducer from "./newsReducer";
import currentPriceReducer from "./currentPriceReducer";
import holdingsReducer from "./holdingsReducer";

const rootReducer = combineReducers({
    user: userReducer,
    news: newsReducer,
    prices: currentPriceReducer,
    holdings: holdingsReducer
});

export default rootReducer;
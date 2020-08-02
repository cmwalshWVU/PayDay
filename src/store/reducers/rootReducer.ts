import { combineReducers } from "redux";
import userReducer from "./userReducer";
import newsReducer from "./newsReducer";
import currentPriceReducer from "./currentPriceReducer";

const rootReducer = combineReducers({
    user: userReducer,
    news: newsReducer,
    prices: currentPriceReducer
});

export default rootReducer;
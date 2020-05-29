import rootReducer from './store/reducers/rootReducer'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

export default function configureStore() {
    const store = createStore(rootReducer, applyMiddleware(thunk))
    return store
}
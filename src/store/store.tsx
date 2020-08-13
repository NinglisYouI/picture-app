import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from 'redux-thunk';
import searchReducer, {SearchState} from '../reducers/search'
import messageReducer from '../reducers/messages';

export interface MainStore {
    message: string;
    search: SearchState;
}

const reducers = combineReducers({
    message: messageReducer,
    search: searchReducer
});

export default createStore(reducers, applyMiddleware(thunk));
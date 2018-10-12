import { combineReducers } from 'redux-immutable';
import { Map } from 'immutable';

import DefaultState from './DefaultState.js'

// eslint-disable-next-line
let initialState = Map({});
console.log(initialState);

const LoginUp = (state = initialState, action) => {
    if (!action.data) {
        return state;
    }
    switch (action.type) {
        case 'SET_ACCOUNT':
            return action.data.account;
        default:
            return state
    }
}

const DayList = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DAYLIST':
            return action.data;
        default:
            return null
    }
}

const HomeMSG = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_HOME_MSG':
            return action.data;
        default:
            return null
    }
}

export default combineReducers({
    account: LoginUp,
    dayList: DayList,
    homeMSG: HomeMSG,
});

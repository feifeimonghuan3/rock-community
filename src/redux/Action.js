import api from '../api';

export function setAccount(data) {
    return (dispatch, getState) => {
        const store = getState([]);
        store.account = data;
        if (store.data === null) {
            delete store.data;
        }
        console.log(store.account.uuid);
        if (!store.account.uuid) {
            dispatch({type: 'SET_ACCOUNT', data: store});
        }

    }
}

export function setDayList(data) {
    return (dispatch, getState) => {
        dispatch({type: 'SET_DAYLIST', data: data});
    }
}

export function setHomeMSG(data) {
    console.log(data);
    return (dispatch, getState) => {
        dispatch({type: 'SET_HOME_MSG', data: data});
    }
}

import * as actionTypes from './Action';

const initialState = {
    username : window.localStorage.getItem('username'),
    //password : "",
    //returnSecureToken: true,
    authToken : window.localStorage.getItem('authToken'),
    isAuthenticated : window.localStorage.getItem('isAuthenticated')
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.TOKENRECEIVED:
            window.localStorage.setItem('username', action.authData.username);
            window.localStorage.setItem('authToken', action.authData.authToken);
            window.localStorage.setItem('isAuthenticated', action.authData.isAuthenticated);
            return {
                ...state,
                username: action.authData.username,
                authToken: action.authData.authToken,
                isAuthenticated: action.authData.isAuthenticated
            }
        case actionTypes.LOGOUT:
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('authToken');
            window.localStorage.removeItem('isAuthenticated');
            return {
                ...state,
                username: "",
                authToken: null,
                isAuthenticated: false
            }
    }
    return state;
};

export default reducer;
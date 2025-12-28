import actionTypes from '../actions/actionTypes';

const initialState = {
    adminContactList: null,
    currentContact: null,
    error: null,
}

const contactReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.GET_ALL_CONTACTS_ADMIN_SUCCESS:
            return {
                ...state,
                adminContactList: action.data,
                error: null
            };
        case actionTypes.GET_ALL_CONTACTS_ADMIN_FAIL:
            return {
                ...state,
                adminContactList: null,
                error: action.msg
            };
        case actionTypes.GET_CONTACT_DETAIL_ADMIN_SUCCESS:
            return {
                ...state,
                currentContact: action.data,
                error: null
            };
        case actionTypes.GET_CONTACT_DETAIL_ADMIN_FAIL:
            return {
                ...state,
                currentContact: null,
                error: action.msg
            };
        default:
            return state;
    }
}

export default contactReducer;

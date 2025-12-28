import actionTypes from '../actions/actionTypes';

const initState = {
    roles: [],
    msg: '',
    loading: true,
};

const roleReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_ROLES_SUCCESS:
            return {
                ...state,
                roles: action.roles || [],
                loading: false,
                msg: '',
            };

        case actionTypes.GET_ROLES_FAIL:
            return {
                ...state,
                roles: [],
                loading: false,
                msg: action.msg || 'Failed to get roles',
            };

        default:
            return state;
    }
};

export default roleReducer;

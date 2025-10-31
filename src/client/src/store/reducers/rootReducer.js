import useReducer from "./userReducer";
import authReducer from "./authReducer";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    user: useReducer,
})

export default rootReducer;
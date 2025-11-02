import useReducer from "./userReducer";
import authReducer from "./authReducer";
import addressReducer from "./addressReducer";
import regionReducer from "./regionReducer";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    user: useReducer,
    address: addressReducer,
    region: regionReducer
})

export default rootReducer;
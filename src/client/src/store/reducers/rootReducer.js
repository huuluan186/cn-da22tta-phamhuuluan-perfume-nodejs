import useReducer from "./userReducer";
import authReducer from "./authReducer";
import addressReducer from "./addressReducer";
import regionReducer from "./regionReducer";
import categoryReducer from "./categoryReducer";
import brandReducer from "./brandReducer";
import productReducer from "./productReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    user: useReducer,
    address: addressReducer,
    region: regionReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
})

export default rootReducer;
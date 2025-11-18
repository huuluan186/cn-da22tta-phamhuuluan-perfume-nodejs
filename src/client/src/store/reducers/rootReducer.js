import useReducer from "./userReducer";
import authReducer from "./authReducer";
import addressReducer from "./addressReducer";
import locationReducer from "./locationReducer";
import categoryReducer from "./categoryReducer";
import brandReducer from "./brandReducer";
import productReducer from "./productReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    user: useReducer,
    address: addressReducer,
    location: locationReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
})

export default rootReducer;
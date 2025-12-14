import useReducer from "./userReducer";
import authReducer from "./authReducer";
import addressReducer from "./addressReducer";
import locationReducer from "./locationReducer";
import categoryReducer from "./categoryReducer";
import brandReducer from "./brandReducer";
import productReducer from "./productReducer";
import couponReducer from "./couponReducer";
import cartReducer from "./cartReducer";
import orderReducer from "./orderReducer"

import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    user: useReducer,
    address: addressReducer,
    location: locationReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
    coupon: couponReducer,
    cart: cartReducer,
    order: orderReducer
})

export default rootReducer;
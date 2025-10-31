import rootReducer from "./store/reducers/rootReducer";
import { legacy_createStore as createStore, applyMiddleware} from "redux";
import { thunk } from "redux-thunk";

const reduxStore=()=>{
    let store = createStore(rootReducer, applyMiddleware(thunk))
    //,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    return {store}
}

export default reduxStore;
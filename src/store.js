import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import appSlice from "./reducers/appSlice";

const store = configureStore({
    reducer : {      
        authenticate: authSlice,
        application:appSlice,
    }
})

export default store;
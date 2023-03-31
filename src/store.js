import {configureStore} from "@reduxjs/toolkit";
import categoryTableSlice from "./reducers/categoryTableSlice";
import customerTableSlice from "./reducers/customerTableSlice";
import enquiryTabelSlice from "./reducers/enquiryTabelSlice";
import orderTableSlice from "./reducers/orderTableSlice";
import productTableSlice from "./reducers/productTableSlice";
import authSlice from "./reducers/authSlice";
import appSlice from "./reducers/appSlice";
import dashboardSlice from "./reducers/dashboardSlice";
import paymentHistorySlice from "./reducers/paymentHistorySlice";
import campaignSlice from "./reducers/campaignSlice";
import analyticSlice from "./reducers/analyticSlice";
import companyslice from "./reducers/companySlice";
import paymentSlice from "./reducers/paymentSlice";
import stocksTableSlice from "./reducers/stocksTableSlice";

const store = configureStore({
    reducer : {
        productTable: productTableSlice,
        categoryTable:categoryTableSlice,
        orderTable:orderTableSlice,
        enquiryTable:enquiryTabelSlice,
        customerTable:customerTableSlice,
        authenticate: authSlice,
        application:appSlice,
        dashboard:dashboardSlice,
        paymentHistory:paymentHistorySlice,
        campaign:campaignSlice,
        analytic: analyticSlice,
        company:companyslice,
        payment:paymentSlice,
        stockTable:stocksTableSlice
    }
})

export default store;
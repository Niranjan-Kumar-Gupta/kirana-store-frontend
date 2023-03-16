import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    toastEdit: false,
    toastdelete: false,
    toastshare: false,
    toastcreate: false,
    toasterror: false
};

const toastSlice = createSlice({
    name: "toastCatgories",
    initialState,
    reducers: {
        toastEditPop: state => {
            state.toastEdit = true;
        },
        toastdeletePop: state => {
            state.toastdelete = true;
        },
        toastsharePop: state => {
            state.toastshare = true;
        },
        toastcreatePop: state => {
            state.toastcreate = true;
        },
        toasterrorPop: state => {
            state.toastcreate = true;
        },
        toastreset: state => {
            state.toastEdit = false;
            state.toastdelete = false,
                state.toastshare = false,
                state.toastcreate = false,
                state.toasterror = false
        }
    },

});

export const { toastEditPop, toastdeletePop, toastsharePop, toastcreatePop, toasterrorPop, toastreset } = toastSlice.actions;
export const getToastdata = (state) => state.toastCatgories;
export default toastSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading:false,
  selectedTab:"/dashboard",
  slidebarOpen:false,
  showNotice:false,
  showGroupShareDialog:false
};

const appSlice = createSlice({
  name: "skalebotApp",
  initialState,
  reducers: {
    changeLoadingStatus(state){
        state.loading = !state.loading
    },
    changeSelectedTab(state, action){
        state.selectedTab = action.payload
    },
    changeSidebarOpenStatus(state){
        state.slidebarOpen = !state.slidebarOpen
    },
    changeShowNotice(state, action){
      state.showNotice = action.payload
    },
    changeShowGroupShareDialog(state,action){
      state.showGroupShareDialog = action.payload;
    } 
  },
});

export const {
    changeLoadingStatus,
    changeSelectedTab,
    changeSidebarOpenStatus,
    changeShowNotice,
    changeShowGroupShareDialog
} = appSlice.actions;

export default appSlice.reducer;

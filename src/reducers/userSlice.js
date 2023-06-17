import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios.instance";
import {API_GET_USER_PROFILE ,API_GET_USERINOUTLET,API_ADD_USER} from "../api/user.service";

const initialState = {
  loading: false,
  userProfile:null,
  usersInOutletData:[],
  selectedUserLocation:null,
  totalUserOutletCount:0,
  page: 0,
  limit: 10,
  mode: null,
};



export const getUserProfile = createAsyncThunk(
    "user/userProfile",
    async (id, thunkAPI) => {
      try {
        const data = await API_GET_USER_PROFILE(id);
        return data;
      }
      catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
      }
    }
  );
  

  
  export const usersInOutlet = createAsyncThunk(
    "user/usersInOutlet",
    async (id, thunkAPI) => {
      try {
        const data = await API_GET_USERINOUTLET(id);
        return data;
      }
      catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
      }
    }
  );
  
  export const addUser = createAsyncThunk(
    "user/addUser",
    async (data, thunkAPI) => {
  
      try {
        const resp = await API_ADD_USER(data);
        return resp;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
      }
    }
  );

const userSlice = createSlice({
  name: "userTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
    changePage(state, action) {
      state.page = action.payload
    },
    changeUserLocation(state, action) {
      console.log(action)
      state.selectedUserLocation = action.payload
    },
  },

  extraReducers: (builder) => {

    builder.addCase( getUserProfile.fulfilled, (state, action) => {
      console.log(action.payload)
      state.userProfile = action.payload;
      state.loading = false;
    });
    builder.addCase( getUserProfile.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase( getUserProfile.rejected, (state) => {
      state.loading = false;
    });


    builder.addCase( usersInOutlet.fulfilled, (state, action) => {
      console.log(action.payload)
      state.totalUserOutletCount = action.payload.count;
      state.usersInOutletData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase( usersInOutlet.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase( usersInOutlet.rejected, (state) => {
      state.loading = false;
    });

    //add user
    builder.addCase(addUser.fulfilled, (state, action) => {
      let data = action.payload;
      if (state.usersInOutletData.length < state.limit) {
        state.usersInOutletData = [data, ...state.usersInOutletData];
      }else{
        state.usersInOutletData = [data, ...state.usersInOutletData.slice(0,state.limit-1)]
      }
      state.toastAction = 'add';
      state.totalUserOutletCount += 1;
      state.loading = false;
    });
    builder.addCase(addUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addUser.rejected, (state) => {
      state.loading = false;
    });

  },
});

export const {
  changeMode,
  resetMode,
  changePage,
  changeUserLocation
} = userSlice.actions;

export default userSlice.reducer;

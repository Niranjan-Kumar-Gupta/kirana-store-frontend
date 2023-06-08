import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios.instance";
import {API_GET_USER_PROFILE ,API_GET_OUTLET,API_GET_USERINOUTLET} from "../api/user.service";

const initialState = {
  loading: false,
  locationData: [],
  usersInOutletData:[],
  totalLocationCount:0,
  totalUserOutletCount:0,
  page: 0,
  limit: 10,
  mode: null,
  pageOutlet: 0,
  limitOutlet: 10,
};



export const userProfile = createAsyncThunk(
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
  

  export const getOutlet= createAsyncThunk(
    "user/outlet",
    async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
      try {
        const data = await API_GET_OUTLET(page, limit,filterData,globalFilterValue);
        return data;
      } catch (err) {
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
    changePageOutlet(state, action) {
      state.page = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase( getOutlet.fulfilled, (state, action) => {
      state.totalLocationCount = action.payload.count;
      state.locationData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase( getOutlet.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase( getOutlet.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase( usersInOutlet.fulfilled, (state, action) => {
      state.totalUserOutletCount = action.payload.outlet_user.length;
      state.usersInOutletData = action.payload.outlet_user;
      state.loading = false;
    });
    builder.addCase( usersInOutlet.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase( usersInOutlet.rejected, (state) => {
      state.loading = false;
    });


  },
});

export const {
  changeMode,
  resetMode,
  changePage,
  changePageOutlet
} = userSlice.actions;

export default userSlice.reducer;

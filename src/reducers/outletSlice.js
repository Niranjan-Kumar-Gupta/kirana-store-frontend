import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios.instance";
import { API_GET_OUTLET,API_ADD_OUTLET } from "../api/outlet.service";

const initialState = {
  loading: false,
  locationData: [],
  totalLocationCount:0,
  page: 0,
  limit: 10,
  mode: null,
};

export const getOutlet = createAsyncThunk(
    "outletTable/outlet",
    async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
      try {
        const data = await API_GET_OUTLET(page, limit,filterData,globalFilterValue);
        return data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
      }
    }
);

export const addOutlet = createAsyncThunk(
  "outletTable/addOutlet",
  async (data, thunkAPI) => {

    try {
      const resp = await API_ADD_OUTLET(data);
      return resp;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);
  
const outletSlice = createSlice({
    name: "outletTable",
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


      //add outlet
      builder.addCase(addOutlet.fulfilled, (state, action) => {
        let data = action.payload;
        if (state.locationData.length < state.limit) {
          state.locationData = [data, ...state.locationData];
        }else{
          state.locationData = [data, ...state.locationData.slice(0,state.limit-1)]
        }
        state.toastAction = 'add';
        state.totalLocationCount += 1;
        state.loading = false;
      });
      builder.addCase(addOutlet.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(addOutlet.rejected, (state) => {
        state.loading = false;
      });
    },
  });
  
  export const {
    changeMode,
    resetMode,
    changePage,
  } = outletSlice.actions;
  
  export default outletSlice.reducer;
  
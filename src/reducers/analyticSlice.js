import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_GET_OVER_ALL_COUNT } from '../api/analytic.service'


const initialState = {
  overAllCount: [],
  loading: false,
};

export const getOverAllCount = createAsyncThunk(
  "analytics/getOverAllCount",
  async ({ startDate,endDate }, thunkAPI) => {
    try {
      let count = await API_GET_OVER_ALL_COUNT(startDate,endDate);
      return count;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const analyticSlice = createSlice({
  name: "analytic",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getOverAllCount.fulfilled, (state, action) => {
      state.overAllCount = action.payload;
      state.loading = false;
    });
    builder.addCase(getOverAllCount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOverAllCount.rejected, (state) => {
      state.loading = false;
    });

  },
});

export default analyticSlice.reducer;
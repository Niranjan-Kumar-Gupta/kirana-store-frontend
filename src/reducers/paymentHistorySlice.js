import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {API_GET_PAYMENT_HISTORY} from '../api/paymentHistory.service'

const initialState = {
  paymentHistory: [],
  totalPaymentHistoryCount: 0,
  loading: false,
  page: 0,
  limit: 10,
}

export const getAllPayments = createAsyncThunk(
  "transaction/paymenthistory",
  async ({page,limit}, thunkAPI) => {
    try {
      const data = await API_GET_PAYMENT_HISTORY(page,limit);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

const paymentHistorySlice = createSlice({
  name: "paymentHistory",
  initialState,
  reducers: {
    changePage(state, action) {
      state.page = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllPayments.fulfilled, (state, action) => {
      state.paymentHistory = action.payload.rows;
      state.totalPaymentHistoryCount = action.payload.count;
      state.loading=false;

    });
    builder.addCase(getAllPayments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllPayments.rejected, (state) => {
      state.loading = false;
    });
  }
});

export const {
  changePage
} = paymentHistorySlice.actions;

export default paymentHistorySlice.reducer;
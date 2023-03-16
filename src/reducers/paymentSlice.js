import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    payumoney,getPlans,fetchInvoice
} from "../api/payment.service";

const initialState = {
  loading: false,
  plans:[],
  data:[],
  transactionD:[]
};

export const sendPayment = createAsyncThunk(
  "payment/",
  async ({data}, thunkAPI) => {
    try {
      let res = await payumoney(data);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchINV = createAsyncThunk(
  "payment/Invoice",
  async ({data}, thunkAPI) => {
    try {
      let res = await fetchInvoice(data);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


export const PlansDetails = createAsyncThunk(
  "payment/plans",
  async ({category},thunkAPI) => {
    try {
      console.log(category)
        let res = await getPlans(category);
        return res;   
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder.addCase(sendPayment.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(sendPayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendPayment.rejected, (state) => {
      state.loading = false;
    });


    builder.addCase(PlansDetails.fulfilled, (state, action) => {
      state.plans = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(PlansDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(PlansDetails.rejected, (state) => {
      state.loading = false;
    });

    
    builder.addCase(fetchINV.fulfilled, (state, action) => {
      state.transactionD = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchINV.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchINV.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {} = paymentSlice.actions;

export default paymentSlice.reducer;

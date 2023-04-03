import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    API_GET_STOCKS,
    API_PUT_STOCKS,
    API_DELETE_STOCKS,
} from "../api/stock.service";

const initialState = {
  loading: false,
  stockData: [],
  totalStockCount:0,
  selectedStock:null,
  page: 0,
  limit: 10,
  mode: null,
};

export const getStocks = createAsyncThunk(
  "stockTable/getStockList",
  async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
    console.log(page,limit,filterData,globalFilterValue)
    try {
      const stocks = await API_GET_STOCKS(page, limit,filterData,globalFilterValue);
      return stocks;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const updateStocks = createAsyncThunk(
  "stockTable/putStock",
  async ( data, thunkAPI) => {
    console.log(data)
    try {
      const stocks = await API_PUT_STOCKS(data);
      return stocks;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);




const stockTableSlice = createSlice({
  name: "stockTableTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
  
    changeSelectedStock(state, action) {
      state.selectedStock = action.payload;
    },
    resetSelectedStock(state) {
      state.selectedCustomer = null;
    },
    changePage(state, action) {
      state.page = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getStocks.fulfilled, (state, action) => {
      state.totalStockCount = action.payload.count;
      state.stockData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getStocks.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(getStocks.rejected, (state) => {
      state.loading = false;
    });

    //put stocks

    builder.addCase(updateStocks.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateStocks.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(updateStocks.rejected, (state) => {
      state.loading = false;
    });

   

  },
});

export const {
  changeMode,
  resetMode,
  changeSelectedStock,
  resetSelectedStock,
  changePage,
} = stockTableSlice.actions;

export default stockTableSlice.reducer;

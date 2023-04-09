import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    API_GET_STOCKS_HISTORY,
    API_PUT_STOCKS_HISTORY,
    API_DELETE_STOCKS_HISTORY,
} from "../api/stockHistory.service";
import {
  removeDeleteData,
  updateProductTable,
  getUnselectedProducts,
  isProductInList,
} from "../utils/tableUtils";


const initialState = {
  loading: false,
  stockHistoryData: [],
  totalStockHistoryCount:0,
  selectedStockHistory:null,
  page: 0,
  limit: 5,
  mode: null,
};

export const getStocksHistory = createAsyncThunk(
  "stockHistoryTable/getStocksHistory",
  async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
    console.log(page,limit,filterData,globalFilterValue)
    try {
      const stocksHistory = await API_GET_STOCKS_HISTORY(page, limit,filterData,globalFilterValue);
      return stocksHistory;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const updateStocksHistory = createAsyncThunk(
  "stockTable/putStock",
  async ( data, thunkAPI) => {
    console.log(data)
    try {
      const stocks = await API_PUT_STOCKS_HISTORY(data);
      return stocks;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  } 
);

export const deleteStocksHistory = createAsyncThunk(
  "stockTable/deleteStock",
  async ( data, thunkAPI) => {
    console.log(data)
    try {
      const stocks = await API_DELETE_STOCKS_HISTORY(data);
      return stocks;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);


const stocksHistoryTableSlice = createSlice({
  name: "stocksHistoryTableTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
  
    changeSelectedStockHistory(state, action) {
      console.log(action)
      state.selectedStockHistory = action.payload;
    },
    resetSelectedStockHistory(state) {
      state.selectedStockHistory = null;
    },
    changePage(state, action) {
      state.page = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getStocksHistory.fulfilled, (state, action) => {
      state.totalStockHistoryCount = action.payload.count;
      state.stockHistoryData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getStocksHistory.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(getStocksHistory.rejected, (state) => {
      state.loading = false;
    });

    //put stocks

    builder.addCase(updateStocksHistory.fulfilled, (state, action) => {
      state.loading = false;
     
    });

    builder.addCase(updateStocksHistory.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(updateStocksHistory.rejected, (state) => {
      state.loading = false;
    });

     //del stocks

     builder.addCase(deleteStocksHistory.fulfilled, (state, action) => {
      console.log(action.payload)
      state.stockHistoryData = removeDeleteData(state.stockHistoryData, action.payload.id);
      state.totalStockHistoryCount -= 1;
      state.loading = false
      state.mode =  null
      state.loading = false;
     
    });

    builder.addCase(deleteStocksHistory.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(deleteStocksHistory.rejected, (state) => {
      state.loading = false;
    });

   

   

  },
});

export const {
  changeMode,
  resetMode,
  changeSelectedStockHistory,
  resetSelectedStockHistory,
  changePage,
} = stocksHistoryTableSlice.actions;

export default stocksHistoryTableSlice.reducer;

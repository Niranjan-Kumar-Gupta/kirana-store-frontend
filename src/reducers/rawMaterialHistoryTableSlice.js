import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  API_GET_RAWMATERIAL_HISTORY,
  API_PUT_RAWMATERIAL_HISTORY,
  API_DELETE_RAWMATERIAL_HISTORY,
  API_PUT_RAWMATERIAL_HISTORY_CHECK
} from "../api/rawMaterialHistory.service";
import {
  removeDeleteData,
  updateProductTable,
  getUnselectedProducts,
  isProductInList,
} from "../utils/tableUtils";


const initialState = {
  loading: false,
  rawMaterialHistoryData: [],
  totalRawMaterialHistoryCount:0,
  selectedRawMaterialHistory:null,
  page: 0,
  limit: 5,
  mode: null,
  toastAction: null,
};

export const getRawMaterialHistory = createAsyncThunk(
  "RawMaterialHistoryTable/getRawMaterialHistory",
  async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
    console.log(page,limit,filterData,globalFilterValue)
    try {
      const rawMaterialHistory = await API_GET_RAWMATERIAL_HISTORY(page, limit,filterData,globalFilterValue);
      return rawMaterialHistory;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const updateRawMaterialHistory = createAsyncThunk(
  "RawMaterialTable/putRawMaterial",
  async ( data, thunkAPI) => {
    
    try {
      const RawMaterial = await API_PUT_RAWMATERIAL_HISTORY(data);
      return RawMaterial;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  } 
);

export const updateRawMaterialHistoryCheck = createAsyncThunk(
  "RawMaterialTable/checkRawMaterial",
  async ( data, thunkAPI) => {
    
    try {
      const RawMaterial = await API_PUT_RAWMATERIAL_HISTORY_CHECK(data);
      return RawMaterial;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  } 
);

export const deleteRawMaterialHistory = createAsyncThunk(
  "stockTable/deleteStock",
  async ( data, thunkAPI) => {
    try {
      const RawMaterial = await API_DELETE_RAWMATERIAL_HISTORY(data);
      return RawMaterial;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);


const rawMaterialHistoryTableSlice = createSlice({
  name: "rawMaterialHistoryTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
  
    changeSelectedRawMaterialHistory(state, action) {
      state.selectedRawMaterialHistory = action.payload;
    },
    resetSelectedRawMaterialHistory(state) {
      state.selectedRawMaterialHistory = null;
    },
    changePage(state, action) {
      state.page = action.payload
    },
    changeToastActionRaw(state, action) {
      state.toastAction = action.payload
    },
    resetToastActionRaw(state) {
      state.toastAction = null
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getRawMaterialHistory.fulfilled, (state, action) => {
      state.totalRawMaterialHistoryCount = action.payload.count;
      state.rawMaterialHistoryData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getRawMaterialHistory.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(getRawMaterialHistory.rejected, (state) => {
      state.loading = false;
    });

    //put stocks

    builder.addCase(updateRawMaterialHistory.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(updateRawMaterialHistory.pending, (state) => {
      state.loading = true;
      
    });
    builder.addCase(updateRawMaterialHistory.rejected, (state) => {
      state.loading = false;
    });

     //put stocks Check

     builder.addCase(updateRawMaterialHistoryCheck.fulfilled, (state, action) => {
      state.loading = false;
     
    });

    builder.addCase(updateRawMaterialHistoryCheck.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(updateRawMaterialHistoryCheck.rejected, (state) => {
      state.loading = false;
    });

     //del stocks

     builder.addCase(deleteRawMaterialHistory.fulfilled, (state, action) => {
      console.log(action.payload)
      state.rawMaterialHistoryData = removeDeleteData(state.rawMaterialHistoryData, action.payload.id);
      state.totalRawMaterialHistoryCount -= 1;
      state.loading = false
      state.mode =  null
      state.loading = false;
     
    });

    builder.addCase(deleteRawMaterialHistory.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(deleteRawMaterialHistory.rejected, (state) => {
      state.loading = false;
    });

   

   

  },
});

export const {
  changeMode,
  resetMode,
  changeSelectedRawMaterialHistory,
  resetSelectedRawMaterialHistory,
  changePage,
  resetToastActionRaw,
  changeToastActionRaw
} = rawMaterialHistoryTableSlice.actions;

export default rawMaterialHistoryTableSlice.reducer;












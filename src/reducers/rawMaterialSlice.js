import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    API_GET_RAWMATERIAL,
    API_ADD_RAWMATERIAL,
    API_DELETE_RAWMATERIAL,
    API_UPDATE_RAWMATERIAL
} from "../api/rawMaterial.service";
import { updateTableData,removeDeleteData } from "../utils/tableUtils";

const initialState = {
  loading: false,
  rawMaterialData: [],
  totalRawMaterialCount:0,
  selectedRawMaterial:null,
  page: 0,
  limit: 10,
  mode: null,
};

export const getRawMaterial = createAsyncThunk(
  "rawMaterialTable/getRawMaterialList",
  async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
    console.log(page,limit,filterData,globalFilterValue)
    try {
      const rawMaterial = await API_GET_RAWMATERIAL(page, limit,filterData,globalFilterValue);
      return rawMaterial;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const addRawMaterial = createAsyncThunk(
  "rawMaterialTable/addRawMaterialList",
  async ( {data,selectedImage} , thunkAPI) => {
 
    try {
      const rawMaterial = await API_ADD_RAWMATERIAL(data,selectedImage);
      
      return rawMaterial;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  } 
);

export const updateRawMaterial = createAsyncThunk(
  "rawMaterialTable/updateRawMaterialList",
  async ( {id,data} , thunkAPI) => {
   
    try {
      const rawMaterial = await API_UPDATE_RAWMATERIAL(id,data);
      return rawMaterial;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const deleteRawMaterial = createAsyncThunk(
  "rawMaterialTable/deleteRawMaterial",
  async ( data, thunkAPI) => {
    console.log(data)
    try {
      const RawMaterial = await  API_DELETE_RAWMATERIAL(data);
      return RawMaterial;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

const rawMaterialTableSlice = createSlice({
  name: "rawMaterialTableTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
  
    changeSelectedRawMaterial(state, action) {
      state.selectedRawMaterial = action.payload;
    },
    resetSelectedRawMaterial(state) {
      state.selectedRawMaterial = null;
    },
    changePage(state, action) {
      state.page = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getRawMaterial.fulfilled, (state, action) => {
      state.totalRawMaterialCount = action.payload.count;
      state.rawMaterialData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getRawMaterial.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(getRawMaterial.rejected, (state) => {
      state.loading = false;
    });

    //add raw material

    builder.addCase(addRawMaterial.fulfilled, (state, action) => {
           
      let data = action.payload.data;
      console.log(data)
      if (state.rawMaterialData.length < state.limit) {
        state.rawMaterialData = [data, ...state.rawMaterialData];
      } else {
        state.rawMaterialData = [
          data,
          ...state.rawMaterialData.slice(0, state.limit - 1),
        ];
      }
      state.totalRawMaterialCount += 1;
      state.loading = false;
    });

    builder.addCase(addRawMaterial.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(addRawMaterial.rejected, (state) => {
      state.loading = false;
    });

    //update raw material
    builder.addCase(updateRawMaterial.fulfilled, (state, action) => {
      console.log(action.payload.data)
      //state.totalRawMaterialCount = action.payload.count;
      state.rawMaterialData = updateTableData(state.rawMaterialData,action.payload.data);
      state.loading = false;
    });
    builder.addCase(updateRawMaterial.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(updateRawMaterial.rejected, (state) => {
      state.loading = false;
    });

    //delete raw material
    builder.addCase(deleteRawMaterial.fulfilled, (state, action) => {
      console.log(action.payload)
      state.totalRawMaterialCount -= 1;
      state.rawMaterialData = removeDeleteData(state.rawMaterialData,action.payload.id);
      state.loading = false
      state.mode =  null
    });
    builder.addCase(deleteRawMaterial.pending, (state) => {
      state.loading = true
      ;
    });
    builder.addCase(deleteRawMaterial.rejected, (state) => {
      state.loading = false;
    });


  },
});

export const {
  changeMode,
  resetMode,
  changeSelectedRawMaterial,
  resetSelectedRawMaterial,
  changePage,
} = rawMaterialTableSlice.actions;

export default rawMaterialTableSlice.reducer;

import { createAsyncThunk, createSlice , current } from "@reduxjs/toolkit";
import {
  API_GET_CATEGORIES,
  API_ADD_CATEGORY,
  API_PUT_CATEGORY,
  API_DELETE_CATEGORY,
} from "../api/category.services";
import { removeDeleteData, updateTableData } from "../utils/tableUtils";

const initialState = {
  categoryData: [],
  totalCategoryCount: 0,
  loading: false,
  selectedCategory: null,
  page: 0,
  limit: 10,
  mode: null,
};

export const getCategories = createAsyncThunk(
  "categoryTable/getCategoryList",
  async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
    try {
      const categories = await API_GET_CATEGORIES(page, limit,filterData,globalFilterValue);
     
      return categories;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }

  }
);

export const addCategory = createAsyncThunk(
  "categoryTable/addCategory",
  async ({data, page, limit}, thunkAPI) => {
    try {
      const resp = await API_ADD_CATEGORY(data);
      if (resp) {
        const respGet =  await API_GET_CATEGORIES(page,limit);     
        return respGet;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categoryTable/updateCategory",
  async ({ categoryId, data,page,limit }, thunkAPI) => {
    try {
      const resp = await API_PUT_CATEGORY(categoryId, data);
      if (resp) {
        const respGet =  await API_GET_CATEGORIES(page,limit);     
        return respGet;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categoryTable/deleteCategory",
  async ({categoryId, page, limit}, thunkAPI) => {
    try {
      const resp = await API_DELETE_CATEGORY(categoryId);
      if (resp) {
        const respGet =  await API_GET_CATEGORIES(page,limit);     
        return respGet;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

const categoryTableSlice = createSlice({
  name: "categoryTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    changeSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    resetSelectedCategory(state) {
      state.selectedCategory = null;
    },
    resetMode(state) {
      state.mode = null;
    },
    changePage(state, action) {
      state.page = action.payload
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.totalCategoryCount = action.payload.count;
      state.categoryData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCategories.rejected, (state) => {
      state.loading = false;
    });
    //add category

    builder.addCase(addCategory.fulfilled, (state, action) => {
      let data = action.payload;
      // if (state.categoryData.length < state.limit) {
      //   state.categoryData = [data, ...state.categoryData];
      // }else{
      //   state.categoryData = [data, ...state.categoryData.slice(0,state.limit-1)]
      // }
      state.categoryData = action.payload.rows
      state.totalCategoryCount = data.count;
      state.loading = false;
    });
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addCategory.rejected, (state) => {
      state.loading = false;
    });

    //update category
    builder.addCase(updateCategory.fulfilled, (state, action) => {
  
     // state.categoryData = updateTableData(current(state).categoryData,action.payload)
     state.categoryData = action.payload.rows
     state.loading = false;  
    });
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCategory.rejected, (state) => {
      state.loading = false;
    });

    //delete category
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categoryData = action.payload.rows
      state.loading = false;
    });
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCategory.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  changeMode,
  resetMode,
  changeSelectedCategory,
  resetSelectedCategory,
  changePage
} = categoryTableSlice.actions;

export default categoryTableSlice.reducer;

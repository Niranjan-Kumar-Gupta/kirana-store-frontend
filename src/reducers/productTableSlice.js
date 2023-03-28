import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  API_ADD_PRODUCT,
  API_GET_PRODUCTS,
  API_GET_PRODUCTS_ID,
  API_PUT_PRODUCT,
  API_DELETE_PRODUCT,
} from "../api/product.services";
import {
  removeDeleteData,
  updateProductTable,
  getUnselectedProducts,
  isProductInList,
} from "../utils/tableUtils";

const initialState = {
  productData: [],
  totalProductCount: 0,
  loading: false,
  selectedProduct: null,
  page: 1,
  limit: 10,
  mode: null,
  selectedProductsList: [],
};

export const getProducts = createAsyncThunk(
  "productTable/getProducts",
  async ({ page=1, limit=10,filterData,globalFilterValue }, thunkAPI) => {
    try {
      // let products = await API_GET_PRODUCTS(page, limit,filterData,globalFilterValue);
      let products = await API_GET_PRODUCTS();
      return products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const addProduct = createAsyncThunk(
  "productTable/addProduct",
  async ({ data, selectedImage }, thunkAPI) => {
    try {
      let product = await API_ADD_PRODUCT(data, selectedImage);
      return product;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "productTable/updateProduct",
  async ({ productId, data ,selectedImage}, thunkAPI) => {
    try {
      let res = await API_PUT_PRODUCT(productId, data, selectedImage);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "productTable/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      let resp = await API_DELETE_PRODUCT(productId);
      return productId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const productTableSlice = createSlice({
  name: "productTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
    setproduct(state, action) {
      if (state.productData.length < state.limit) {
        state.productData = [action.payload, ...state.productData];
      }
      state.totalProductCount += 1;
    },
    changeSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },

    resetSelectedProduct(state) {
      state.selectedProduct = null;
    },

    changePage(state, action) {
      state.page = action.payload;
    },

    updateSelectedProductsList(state, action) {
      const { selectedProducts, currProducts } = action.payload;

      if (!state.selectedProductsList.length) {
        state.selectedProductsList = selectedProducts;
      } else {
        const newItems = selectedProducts.filter((product) => {
          if (!isProductInList(state.selectedProductsList, product))
            return product;
        });
        const unselectedProducts = getUnselectedProducts(
          currProducts,
          selectedProducts
        );

        const onlySelectedItems = state.selectedProductsList.filter(
          (product) => {
            if (!isProductInList(unselectedProducts, product)) return product;
          }
        );
        state.selectedProductsList = [...onlySelectedItems, ...newItems];
      }
    },
    resetSelectedProductsList(state){
      state.selectedProductsList = []
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.totalProductCount = action.payload.count;
      state.productData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.loading = false;
    });

    //add product

    builder.addCase(addProduct.fulfilled, (state, action) => {
      let data = action.payload;
      if (state.productData.length < state.limit) {
        state.productData = [data, ...state.productData];
      } else {
        state.productData = [
          data,
          ...state.productData.slice(0, state.limit - 1),
        ];
      }

      state.totalProductCount += 1;
      state.loading = false;
    });

    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addProduct.rejected, (state) => {
      state.loading = false;
    });

    // update product
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const d = new Date();
      let data={...action.payload,url:`${action.payload.url}?v=${d.getTime()}`};  
      state.productData = updateProductTable(state.productData, data);
      state.loading = false;
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProduct.rejected, (state) => {
      state.loading = false;
    });

    // delete product
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.productData = removeDeleteData(state.productData, action.payload);
      state.totalProductCount -= 1;
      state.loading = false
      state.mode =  null
    });

    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteProduct.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  changeMode,
  changeSelectedProduct,
  resetSelectedProduct,
  resetMode,
  changePage,
  setproduct,
  updateSelectedProductsList,
  resetSelectedProductsList
} = productTableSlice.actions;

export default productTableSlice.reducer;

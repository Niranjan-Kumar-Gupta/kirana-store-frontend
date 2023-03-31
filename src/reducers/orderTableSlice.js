import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ADD_ORDER, API_GET_ORDERS, API_GET_ORDER_DETAILS, API_PUT_ORDER } from "../api/order.services";
import { updateTableData, isProductInList, getUnselectedProducts } from "../utils/tableUtils";

const initialState = {
  orderData: [],
  totalOrderCount: 0,
  loading: false,
  selectedOrderId:"",
  selectedOrder:{},
  page: 0,
  limit: 10,
  mode: null,
  selectedOrdersList: [],
  orderDet: {},
  orderDetails: {}
};

export const getOrders = createAsyncThunk(
  "orderTable/getOrderList",
  async ({ page, limit,filterData,globalFilterValue}, thunkAPI) => {
    try {
      let orders = await API_GET_ORDERS(page, limit,filterData,globalFilterValue);
      return orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "orderTable/getOrderDetails",
  async ( orderId, thunkAPI) => {
    try {
      let orderDet = await API_GET_ORDER_DETAILS(orderId);
      return orderDet;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

export const addOrder = createAsyncThunk(
  "orderTable/addOrder",
  async (data, thunkAPI) => {
    try {
      const resp = await API_ADD_ORDER(data);
      return resp;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orderTable/updateStatus",
  async ({ orderId, updatedData }, thunkAPI) => {
    try {
      const resp = await API_PUT_ORDER(orderId, updatedData);
      return resp;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

const orderTableSlice = createSlice({
  name: "orderTable",
  initialState,
  reducers: {
    updateMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
    changeSelectedOrder(state, action) {
      const order = action.payload;
      state.selectedOrder = order;
      state.selectedOrderId = order.id;
    },
    changePage(state, action) {
      state.page = action.payload
    },
    resetSelectedOrder(state) {
      state.selectedOrderId = "all";
      state.selectedOrder = {id:"all", orderLabel:"All Orders"};
    },
    updateSelectedOrdersList(state, action) {
      const { selectedOrders, currOrders} = action.payload
      if (!state.selectedOrdersList?.length) {
        state.selectedOrdersList = selectedOrders
      } else {
        const newSelection = selectedOrders.filter((order) => {
          if (!isProductInList(state.selectedOrdersList, order))
            return order
        });
        const unselectedOrders = getUnselectedProducts(
          currOrders,
          selectedOrders
        );
        const onlySelectedItems = state.selectedOrdersList.filter(
          (order) => {
            if (!isProductInList(unselectedOrders, order)) return order;
          }
        );
        state.selectedOrdersList = [...onlySelectedItems, ...newSelection];
      }
    },
    resetSelectedOrdersList(state) {
      state.selectedOrdersList = []
    },
    resetOrderDetails(state) {
      state.orderDet = {}
      state.orderDetails = {}
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.totalOrderCount = action.payload.count;
      state.orderData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrders.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.orderDet = action.payload;
      state.orderDetails = action.payload.orderDetails
      state.selectedOrderId = action.payload.id
      state.loading = false;
    });
    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrderDetails.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(addOrder.fulfilled, (state, action) => {
      let data = action.payload;
      if (state.orderData.length < state.limit) {
        state.orderData = [data, ...state.orderData];
      }else{
        state.orderData = [data, ...state.orderData.slice(0, state.limit-1)]
      }
      state.totalOrderCount += 1;
      state.loading = false;
    });
    builder.addCase(addOrder.pending, (state) => {
      state.loading = true
    });
    builder.addCase(addOrder.rejected, (state) => {
      state.loading = false
    })

    builder.addCase(updateOrder.fulfilled, (state, action) => {
      const order = action.payload;
      state.orderDet = order
      state.orderDetails = order.orderDetails
      state.loading = false
    });
    builder.addCase(updateOrder.pending, (state) => {
      state.loading = true
    });
    builder.addCase(updateOrder.rejected, (state) => {
      state.loading = false
    })

  },
});

export const { updateMode, changePage, changeSelectedOrder, resetSelectedOrder, resetMode, updateSelectedOrdersList, resetSelectedOrdersList, resetOrderDetails } = orderTableSlice.actions;

export default orderTableSlice.reducer;

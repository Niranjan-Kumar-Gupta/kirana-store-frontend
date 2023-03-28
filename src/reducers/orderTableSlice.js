import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_GET_ORDERS, API_GET_ORDER_DETAILS, API_PUT_ORDER } from "../api/order.services";
import { updateTableData, isProductInList, getUnselectedProducts } from "../utils/tableUtils";

const initialState = {
  orderData: [],
  totalOrderCount: 0,
  loading: false,
  selectedOrderId:"all",
  selectedOrder:{id:"all", orderLabel:"All Orders"},
  selectedOrderProducts:[],
  page: 0,
  limit: 10,
  mode: null,
  selectedOrdersList: [],
  orderDetails: {},
};

export const getOrders = createAsyncThunk(
  "orderTable/getOrderList",
  async ({ page, limit,startDate,endDate,filterData,globalFilterValue}, thunkAPI) => {
    try {
      let orders = await API_GET_ORDERS(page, limit,startDate,endDate,filterData,globalFilterValue);
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
      let orderDetails = await API_GET_ORDER_DETAILS(orderId);
      return orderDetails;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

export const updateOrder = createAsyncThunk(
  "orderTable/updateStatus",
  async ({ orderId, updatedStatus }, thunkAPI) => {
    try {
      const resp = await API_PUT_ORDER(orderId, updatedStatus);
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
      if(order.id !== "all"){
        state.selectedOrderProducts = order.productItems;
        state.selectedOrder = order;
      
      }else{
        state.selectedOrder = {id:"all", orderLabel:"All Orders"};
        state.selectedOrderProducts = []
      }
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
      state.orderDetails = action.payload;
      state.loading = false;
    });
    builder.addCase(getOrderDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrderDetails.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateOrder.fulfilled, (state, action) => {
      const order = action.payload;
      state.orderData = updateTableData(state.orderData, order);
      state.selectedOrder = {...order,orderLabel:`Order Id #${order.id}`};
      state.loading = false
      state.mode = null
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

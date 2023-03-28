import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  API_ADD_CUSTOMER,
  API_DELETE_CUSTOMER,
  API_GET_CUSTOMERS,
  API_PUT_CUSTOMER,
  API_GET_GROUPS,
  API_GET_GROUP_CUSTOMERS,
  API_CREATE_GROUP,
  API_PUT_GROUP
} from "../api/customer.services";
import { removeDeleteData, updateTableData } from "../utils/tableUtils";

const initialState = {
  loading: false,
  groupCustomerLoading:false,
  showCustomersType:"all",
  selectedGroupID:"all",
  groups:[],
  selectedGroup:{id:"all", groupName:"All Groups"},
  customerData: [],
  customersInSelectedGroup:[],
  totalGroupCount:0,
  customerCountInGroup:0,
  totalCustomerCount: 0,
  selectedCustomer: null,
  groupPage:0,
  groupCustomerPage:0,
  page: 0,
  limit: 10,
  mode: null,
};

export const getCustomers = createAsyncThunk(
  "customerTable/getCustomerList",
  async ({ page, limit,filterData,globalFilterValue }, thunkAPI) => {
    console.log(page,limit,filterData,globalFilterValue)
    try {
      const customers = await API_GET_CUSTOMERS(page, limit,filterData,globalFilterValue);
      return customers;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const getCustomerRole = createAsyncThunk(
  "customerTable/getCustomerList",
  async ({ page, limit }, thunkAPI) => {
    try {
      const customerRole = 'pro';//await API_GET_CUSTOMERS(page, limit);
      return customerRole;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const addCustomer = createAsyncThunk(
  "customerTable/addCustomer",
  async (data, thunkAPI) => {

    try {
      const resp = await API_ADD_CUSTOMER(data);
      return resp;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customerTable/updateCustomer",
  async (args, thunkAPI) => {
    try {
      const { customerId, data } = args;
      const resp = await API_PUT_CUSTOMER(customerId, data);
      return resp;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customerTable/deleteCategory",
  async (customerId, thunkAPI) => {
    try {
      const resp = await API_DELETE_CUSTOMER(customerId);
      return customerId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const createGroup = createAsyncThunk(
  "customers/group",
  async (data, thunkAPI) => {
    try {    
      const resp = await API_CREATE_GROUP(data);
      return resp;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);


export const getGroups = createAsyncThunk(
  "customerTable/getGroups",
  async ({ page, limit ,globalFilterValue}, thunkAPI) => {
    console.log(globalFilterValue)
    try {
      const groups = await API_GET_GROUPS(page, limit,globalFilterValue);
      return groups;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)
export const getCustomersInGroups = createAsyncThunk(
  "customerTable/getCustomersInGropus",
  async ({id, page, limit }, thunkAPI) => {
    try {
      const customersInGroups = await API_GET_GROUP_CUSTOMERS(id,page, limit);
      return customersInGroups;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const updateGroup = createAsyncThunk(
  "group/updateGroup",
  async ({groupId, data}, thunkAPI) =>{
    try{
      const updatedGroupData = await API_PUT_GROUP(groupId,data)
      return updatedGroupData
    }catch(err){
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

const customerTableSlice = createSlice({
  name: "customerTable",
  initialState,
  reducers: {
    changeMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
    changeSelectedGroupId(state,action){
      if(action.payload == "all"){
        state.selectedGroup = {id:"all", groupName:"All Groups"}
        state.customersInSelectedGroup = []
      }else{
        const group = state.groups.filter(grp=>grp.id == action.payload);
        state.selectedGroup = group[0]
      }
      state.selectedGroupID = action.payload;
    },
    changeSelectedCustomer(state, action) {
      state.selectedCustomer = action.payload;
    },
    resetSelectedCustomer(state) {
      state.selectedCustomer = null;
    },
    changePage(state, action) {
      state.page = action.payload
    },
    changeShowCustomersType(state, action){
      const customerType = action.payload;
      if(customerType == "all"){
        state.selectedGroupID = "all"
        state.customersInSelectedGroup = [];
        state.selectedGroup = {id:"all", groupName:"All Groups"}
      }
      state.showCustomersType = action.payload;
    },
    changeSelectedGroup(state, action){
      state.selectedGroupID = action.payload.id
      state.selectedGroup = action.payload;
    },
    resetSelectedGroup(state){
      state.selectedGroupID = "all"
      state.selectedGroup = {id:"all", groupName:"All Groups"}
    },
    changeGroupPage(state,action){
      state.groupPage = action.payload
    },
    changeGroupCustomerPage(state, action){
      state.groupCustomerPage = action.payload
    },
    setSelectedGroupIdToNull(state) {
      state.selectedGroupID = null;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      state.totalCustomerCount = action.payload.count;
      state.customerData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getCustomers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCustomers.rejected, (state) => {
      state.loading = false;
    });

    //add customer
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      let data = action.payload;
      if (state.customerData.length < state.limit) {
        state.customerData = [data, ...state.customerData];
      }else{
        state.customerData = [data, ...state.customerData.slice(0,state.limit-1)]
      }
      state.totalCustomerCount += 1;
      state.loading = false;
    });
    builder.addCase(addCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addCustomer.rejected, (state) => {
      state.loading = false;
    });

    //update customer
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.customerData = updateTableData(state.customerData, action.payload);
      state.loading = false;
    });
    builder.addCase(updateCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCustomer.rejected, (state) => {
      state.loading = false;
    });

    //delete customer
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.customerData = removeDeleteData(state.customerData, action.payload);
      state.totalCustomerCount -= 1;
      state.loading = false;
    });
    builder.addCase(deleteCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCustomer.rejected, (state) => {
      state.loading = false;
    });

    //get all groups
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.totalGroupCount = action.payload.count;
      state.groups = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getGroups.rejected, (state) => {
      state.loading = false;
    });

    //add group
    builder.addCase(createGroup.fulfilled, (state, action) => {
      let data = action.payload;
      if (state.groups.length < state.limit) {
        state.groups = [data, ...state.groups];
      }else{
        state.groups = [data, ...state.groups.slice(0,state.limit-1)]
      }
      state.totalGroupCount += 1;
      state.loading = false;
    });
    builder.addCase(createGroup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createGroup.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getCustomersInGroups.fulfilled, (state, action) => {
      state.customerCountInGroup = action.payload.count;
      state.customersInSelectedGroup = action.payload.rows;
      state.groupCustomerLoading = false;
    });
    builder.addCase(getCustomersInGroups.pending, (state) => {
      state.groupCustomerLoading = true;
    });
    builder.addCase(getCustomersInGroups.rejected, (state) => {
      state.groupCustomerLoading = false;
    });
    
    builder.addCase(updateGroup.fulfilled, (state,action) =>{
      state.loading = false;
      state.groups = updateTableData(state.groups, action.payload)
      state.selectedGroup = action.payload
    });
    builder.addCase(updateGroup.pending, (state) =>{
      state.loading = true;
    });
    builder.addCase(updateGroup.rejected, (state) =>{
      state.loading = false;
    })
    

  },
});

export const {
  changeMode,
  resetMode,
  changeSelectedCustomer,
  resetSelectedCustomer,
  changePage,
  changeGroupCustomerPage,
  changeGroupPage,
  changeShowCustomersType,
  changeSelectedGroup,
  resetSelectedGroup,
  changeSelectedGroupId,
  setSelectedGroupIdToNull
} = customerTableSlice.actions;

export default customerTableSlice.reducer;

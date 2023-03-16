import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  API_ADD_CAMPAIGN,
  API_GET_CAMPAIGNS,
  API_GET_IMAGE_CONFIG,
  API_GET_TEMPLATES,
} from "../api/campaign.service";
import { API_GET_CAMPAIGN_CUSTOMERS, API_GET_CAMPAIGN_ANALYTICS } from "../api/dashboard.service";


const initialState = {
  page:0,
  limit:10,
  campaignLoading: false,
  campaignType:"product",
  campaignData: [],
  broadcastData:[],
  campaignCount:0,
  broadcastCount:0,
  campaignTemplates: {},
  selectedCampaignId:"all",
  selectedCampaign:{id:"all", campaignName:"All Campaigns"},
  campCustomerPage:0,
  campaignCustomers:[],
  stats:[]
};

export const addCampaign = createAsyncThunk(
  "campaign/addCampaign",
  async ({ configData, image }, thunkAPI) => {
    try {
      if (image) {
        const { src, url } = await API_GET_IMAGE_CONFIG({
          imageType: "broadcast",
        });

        await axios.put(src, image, {
          headers: { "Content-Type": "image/png" },
        });
        configData["variables"] = {
          var1: url,
          var2: configData.message,
        };
      } else {
        configData["variables"] = {
          var1: configData.message,
        };
      }
      let data = await API_ADD_CAMPAIGN(configData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getCampaignTemplates = createAsyncThunk(
  "campaign/getTemplates",
  async (_, thunkAPI) => {
    try {
      const data = await API_GET_TEMPLATES();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCampaigns  = createAsyncThunk(
  "campaign/getCampaigns",
  async ({page,limit,campaignType,startDate,endDate,globalFilterValue}, thunkAPI) =>{
    try {
      const data = await API_GET_CAMPAIGNS(page,limit,campaignType,startDate,endDate,globalFilterValue);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

export const getCampaignCustomers = createAsyncThunk(
  "dashboard/getCampaignCustomers",
  async ({id,page,limit,status},thunkAPI) => {
    try {
      const data = await API_GET_CAMPAIGN_CUSTOMERS(id,page,limit,status);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const getCampaignsAnalytics = createAsyncThunk(
  "dashboard/getCampaignAnalytics",
  async ({id}, thunkAPI) => {
    try {
      const data = await API_GET_CAMPAIGN_ANALYTICS(id);
    
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    changeCampaignType(state,action){
      state.campaignType = action.payload;
      state.page = 0
      state.selectedCampaignId = "all"
      if(action.payload === "product" ){
        state.selectedCampaign = {id:"all", campaignName:"All Campaigns"}
      }else{
        state.selectedCampaign = {id:"all", campaignName:"All Broadcasts"}
      }
    },
    resetCampaignType(state){
      state.campaignType = "product";
      state.selectedCampaignId = "all";
      state.selectedCampaign = {id:"all", campaignName:"All Campaigns"}
    },
    changePage(state, action) {
      state.page = action.payload
    },
    changecampCustomerPage(state, action){
      state.campCustomerPage = action.payload
    },
    changeSelectedCampaignId(state, action){
      if(action.payload !== "all"){
       const  campDetails = state.campaigns.filter(camp => camp.id === action.payload);  
        state.selectedCampaign = campDetails[0];
      }else{
        state.selectedCampaign = {id:"all", campaignName:"All Campaigns"}
      }
      state.selectedCampaignId = action.payload
    },
    changeSelectedCampaign(state,action){
      state.selectedCampaignId = action.payload.id;
      state.selectedCampaign = action.payload
    },
    clearCampaignCustomers(state){
      state.campaignCustomers = [];
    },
    resetSelectedCampaign(state){
      state.selectedCampaignId = "all";
      state.selectedCampaign = {id:"all", campaignName:"All Campaigns"}
    }
  },
  extraReducers: (builder) => {
    //get templates
    builder.addCase(getCampaignTemplates.fulfilled, (state, action) => {
      state.campaignTemplates = action.payload;
    });

    //add new campaign
    builder.addCase(addCampaign.fulfilled, (state, action) => {
      state.campaignLoading = false;
      if(state.campaignType === 'broadcast'){
        if(state.broadcastData.length < state.limit){
          state.broadcastData = [action.payload, ...state.broadcastData]
        }else{
          state.broadcastData = [action.payload, ...state.broadcastData.slice(0, state.limit - 1)]
        }
        state.campaignCount += 1
      }
     
    });
    builder.addCase(addCampaign.pending, (state) => {
      state.campaignLoading = true;
    });
    builder.addCase(addCampaign.rejected, (state) => {
      state.campaignLoading = false;
    });

    //get campaigns
    builder.addCase(getCampaigns.fulfilled, (state,action) => {
      if(state.campaignType ==='product'){
        state.campaignData = action.payload.rows;
        state.campaignCount = action.payload.count;
      }else{
        state.broadcastData = action.payload.rows;
        state.broadcastCount = action.payload.count
      }
      state.campaignLoading = false;
    });
    builder.addCase(getCampaigns.pending, (state)=>{
      state.campaignLoading = true;
    });
    builder.addCase(getCampaigns.rejected, (state)=>{
      state.campaignLoading = false;
    })

    
    builder.addCase(getCampaignCustomers.fulfilled, (state, action) => {
      state.campaignLoading=false
      state.campaignCustomers = action.payload.customers
      state.totalCampaignCustomersCount = action.payload.count;
  });
  builder.addCase(getCampaignCustomers.pending, (state) => {
    state.campaignLoading = true;
  });
  builder.addCase(getCampaignCustomers.rejected, (state) => {
    state.campaignLoading = false;
  });

  builder.addCase(getCampaignsAnalytics.fulfilled, (state, action) => {
       state.campaignLoading=false
       state.stats = action.payload
   });
   builder.addCase(getCampaignsAnalytics.pending, (state) => {
     state.campaignLoading = true;
   });
   builder.addCase(getCampaignsAnalytics.rejected, (state) => {
     state.campaignLoading = false;
   });
  },
});

export const {
  changeSelectedCampaign,
  changePage,
  clearCampaignCustomers,
  changecampCustomerPage,
  changeSelectedCampaignId,
  resetSelectedCampaign,
  changeCampaignType,
  resetCampaignType
} =campaignSlice.actions

export default campaignSlice.reducer;

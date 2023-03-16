import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_GET_ENQURIES, API_PUT_ENQURY } from "../api/enquiry.services";
import { updateTableData } from "../utils/tableUtils";

const initialState = {
  enquiryData: [],
  totalEnquiryCount: 0,
  loading: false,
  selectedEnquiry: null,
  page: 0,
  limit: 10,
  mode: null,
};

export const getEnquiries = createAsyncThunk(
  "enquiryTable/getEnquiryList",
  async ({ page, limit,startDate,endDate,filterData,globalFilterValue }, thunkAPI) => {
    try {
      const enquiries = await API_GET_ENQURIES(page, limit,startDate,endDate,filterData,globalFilterValue);
      return enquiries;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateEnquiry = createAsyncThunk(
  "enquiryTable/updateStatus",
  async ({ enquiryId, updatedStatus }, thunkAPI) => {
    try {
      const data = await API_PUT_ENQURY(enquiryId, updatedStatus);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

const enquiryTableSlice = createSlice({
  name: "enquiryTable",
  initialState,
  reducers: {
    updateMode(state, action) {
      state.mode = action.payload;
    },

    resetMode(state) {
      state.mode = null;
    },
    changeSelectedEnquiry(state, action) {
      state.selectedEnquiry = action.payload;
    },

    resetSelectedEnquiry(state) {
      state.selectedEnquiry = null;
    },
    changePage(state, action) {
      state.page = action.payload
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getEnquiries.fulfilled, (state, action) => {
      state.totalEnquiryCount = action.payload.count;
      state.enquiryData = action.payload.rows;
      state.loading = false;
    });
    builder.addCase(getEnquiries.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getEnquiries.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateEnquiry.fulfilled, (state, action) => {
      state.enquiryData = updateTableData(state.enquiryData, action.payload)
      state.selectedEnquiry = null;
      state.loading = false
      state.mode = null
    });
    builder.addCase(updateEnquiry.pending, (state) => {
      state.loading = true
    });
    builder.addCase(updateEnquiry.rejected, (state) => {
      state.loading = false
    })
  },
});

export const { updateMode, changePage, resetMode, changeSelectedEnquiry, resetSelectedEnquiry } = enquiryTableSlice.actions;

export default enquiryTableSlice.reducer;

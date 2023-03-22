import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    API_ADD_COMPANY,
    API_DELETE_COMPANY,
    API_GET_COMPANY,
    API_PUT_COMPANY,
} from "../api/company.service";

const initialState = { company: null};


export const getCompany = createAsyncThunk(
    "company/getCompany",
    async (companyId, thunkAPI) => {
      try {
        const company = await API_GET_COMPANY(companyId);
        return company;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
      }
    }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({companyId, updatedData}, thunkAPI) => {
    try {
     const company = await API_PUT_COMPANY(companyId,updatedData);
     return company;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
      setCompany(state, action) {
        state.company = action.payload;
      },
    },
  });
  
  export const { setCompany } = companySlice.actions;
  export default companySlice.reducer;
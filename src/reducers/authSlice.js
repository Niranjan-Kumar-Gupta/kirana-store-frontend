import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_LOGIN, API_LOGOUT, API_SUBSCRIPTION } from "../api/auth.service";
import parseJwt from "../utils/authUtils";
import Cookies from "js-cookie";
import axiosInstance from "../api/axios.instance";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await API_LOGIN(credentials);
      return data;
    }
    catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const data = await API_LOGOUT();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const subscription  = createAsyncThunk(
  "auth/subscription ",
  async (customerId, thunkAPI) => {
    try {
      const data = await  API_SUBSCRIPTION(customerId);
      return data;
    }
    catch (err) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

const initialState = { 
  loading: false,
  isLogedIn: false,
  user: null,
  userSub:{
    isUserSub:false,
    userSubType:'none',
    plan:''
  },
  conversation:{
    total:0,
    used:0,
    remain:0
  } 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.isLogedIn = true;
      state.user = action.payload
    },
    resetUser(state) {
      state.isLogedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const token = action.payload.token;
      //Cookies.set('token', token, { sameSite : "none", secure: true, httpOnly : true});
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common["authorization"] = token;
      const user = parseJwt(token);
      state.user = user
      state.isLogedIn = true;
      state.loading = false;
    });
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLogedIn = false;
      state.user = null;
      state.loading = false;
    })
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
    })
    builder.addCase(subscription.fulfilled, (state,action) => {    
      if (action.payload.subscription) {       
      if (action.payload) {
        state.conversation={
          total:action.payload.totalConversation,
          used:action.payload.usedConversation,
          remain:action.payload.totalConversation-action.payload.usedConversation
        } 
      }
      const {annual,monthly,name} = action.payload.subscription?.subscriptiontype;
      if (annual || monthly) {
        state.userSub = {
          isUserSub:true,
          userSubType:name,
          plan:annual?'annual':'monthly'
        }
        localStorage.setItem('userSub',JSON.stringify(state.userSub));
      }else{
        state.userSub = {
          isUserSub:false,
          userSubType:'none',
          plan:annual?'':''
        }
        localStorage.setItem('userSub',JSON.stringify(state.userSub));
      }

      }
    })
  },
});

export const { setUser, resetUser } = authSlice.actions;
export default authSlice.reducer;
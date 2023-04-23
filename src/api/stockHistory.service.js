import axiosInstance from "./axios.instance";
import axios from "axios";
// apies calls for products
const API_GET_STOCKS_HISTORY = async (pageNo, limit,filterData,globalFilterValue) => {
  try {
    var resp;
    if (filterData || globalFilterValue) {
      console.log(filterData,globalFilterValue)
      let allFilter=''
      if (filterData) {
        let entries = Object.entries(filterData)
        entries.map( ([key, val]) => {
         allFilter += `&${key}=${val}`
       });
       }
      if (globalFilterValue) {
         allFilter += `&global=${globalFilterValue}`
      }
      resp = await axiosInstance.get(
        `/stockhistory?page=${pageNo}&limit=${limit}${allFilter}`
         )
    }
    else{
      resp = await axiosInstance.get(
      `/stockhistory?page=${pageNo}&limit=${limit}`
      );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};


const API_PUT_STOCKS_HISTORY =  async (__data) => {
  try {
    const resp = await axiosInstance.put(`/stockhistory/${__data.id}`, __data.data); 
    console.log(resp)
    return resp;
  } catch (err) {
    throw err;
  }
};


const API_PUT_STOCKS_HISTORY_CHECK =  async (__data) => {
  try {
    const resp = await axiosInstance.put(`/stock`, __data); 
    console.log(resp)
    return resp;
  } catch (err) {
    throw err;
  }
};

const API_DELETE_STOCKS_HISTORY = async (__data) => {
  try {
    const resp = await axiosInstance.delete(`/stockhistory/${__data.id}`, __data.data); 
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export {
  API_GET_STOCKS_HISTORY,
  API_PUT_STOCKS_HISTORY,
  API_DELETE_STOCKS_HISTORY,
  API_PUT_STOCKS_HISTORY_CHECK
};

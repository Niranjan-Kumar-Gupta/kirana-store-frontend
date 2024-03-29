import axiosInstance from "./axios.instance";
import axios from "axios";
// apies calls for products
const API_GET_STOCKS = async (pageNo, limit,filterData,globalFilterValue) => {
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
        `/stock?page=${pageNo}&limit=${limit}${allFilter}`
         )
    }
    else{
      resp = await axiosInstance.get(
      `/stock?page=${pageNo}&limit=${limit}`
      );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};


const API_PUT_STOCKS = async (__data) => {
  console.log(__data)
  try {
    const resp = await axiosInstance.put(`/stock`, __data); 
    console.log(resp)
    return resp;
  } catch (err) {
    throw err;
  }
};

const API_DELETE_STOCKS = async (productID) => {
  try {
    const resp = await axiosInstance.delete(`/stock/${productID}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export {
  API_GET_STOCKS,
  API_PUT_STOCKS,
  API_DELETE_STOCKS,
};

import axiosInstance from "./axios.instance";
import axios from "axios";
// apies calls for products
const API_GET_RAWMATERIAL_HISTORY = async (pageNo, limit,filterData,globalFilterValue) => {
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
        `/rawstockhistory?page=${pageNo}&limit=${limit}&isActive=1${allFilter}`
         )
    }
    else{
      resp = await axiosInstance.get(
      `/rawstockhistory?page=${pageNo}&limit=${limit}&isActive=1`
      );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};


const API_PUT_RAWMATERIAL_HISTORY =  async (__data) => {
  console.log(__data)
  
  console.log(__data.id,__data.data)
  try {
    const resp = await axiosInstance.put(`/rawstockhistory/${__data.id}`, __data.data); 
    console.log(resp)
    return resp;
  } catch (err) {
    throw err;
  }
};


const API_PUT_RAWMATERIAL_HISTORY_CHECK =  async (data) => {
  try {
    const resp = await axiosInstance.put(`/rawstock/`, data); 
    return resp;
  } catch (err) {
    throw err;
  }
};

const API_DELETE_RAWMATERIAL_HISTORY = async (id) => {
  try {
    const resp = await axiosInstance.delete(`/rawstockhistory/${id}`); 
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_GET_RAWMATERIAL_HISTORY_BY_ID = async (id) => {
  try {
    const resp = await axiosInstance.get(`/rawstockhistory/${id}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

const API_UPDATE_RAWMATERIAL_HISTORY_BY_ID= async (id, data) => {
  try {
    const resp = await axiosInstance.put(`/rawstockhistory/${id}`, data);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

export {
  API_GET_RAWMATERIAL_HISTORY,
  API_PUT_RAWMATERIAL_HISTORY,
  API_DELETE_RAWMATERIAL_HISTORY,
  API_PUT_RAWMATERIAL_HISTORY_CHECK,
  API_GET_RAWMATERIAL_HISTORY_BY_ID,
  API_UPDATE_RAWMATERIAL_HISTORY_BY_ID
};

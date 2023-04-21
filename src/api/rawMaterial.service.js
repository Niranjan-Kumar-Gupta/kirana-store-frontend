import axiosInstance from "./axios.instance";
import axios from "axios";
// apies calls for products
const API_GET_RAWMATERIAL= async (pageNo, limit,filterData,globalFilterValue) => {
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
        `/material?page=${pageNo}&limit=${limit}${allFilter}`
         )
    }
    else{
      resp = await axiosInstance.get(
      `/material?page=${pageNo}&limit=${limit}`
      );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_GET_RAW_STOCK_MATERIAL= async (pageNo, limit,filterData,globalFilterValue) => {
  try { 
    let  resp = await axiosInstance.get(`/rawstock?page=${pageNo}&limit=${limit}` )
    return resp.data;
  } catch (err) {
    throw err;
  }
};


const API_ADD_RAWMATERIAL= async (data,image) => {
  console.log(data,image)
  try {
    const resp = await axiosInstance.post(`/material`, data); 
    console.log(resp)
    const imgUploadUrl = resp.data.src;
     console.log(imgUploadUrl,resp)
    if(imgUploadUrl && image){
      console.log(imgUploadUrl,image)
      const uploded = await axios.put(imgUploadUrl,image,{headers:{'Content-Type': 'image/png'}})
      console.log(uploded)
    }
    
    return resp;
  } catch (err) {
    throw err;
  }
};

const API_UPDATE_RAWMATERIAL= async (id,data) => {
  console.log(id,data)
  try {
    const resp = await axiosInstance.put(`/material/${id}`, data); 
    
    return resp;
  } catch (err) {
    throw err;
  }
};

const API_DELETE_RAWMATERIAL= async (ID) => {
  try {
    const resp = await axiosInstance.delete(`/material/${ID}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export {
  API_GET_RAWMATERIAL,
  API_ADD_RAWMATERIAL,
  API_UPDATE_RAWMATERIAL,
  API_DELETE_RAWMATERIAL,
  API_GET_RAW_STOCK_MATERIAL
};

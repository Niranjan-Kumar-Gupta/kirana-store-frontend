import axiosInstance from "./axios.instance";
import axios from "axios";
// apies calls for products
const API_GET_PRODUCTS = async (pageNo, limit) => {
  try {
    var resp;
    // pageNo, limit,filterData,globalFilterValue
    // if (filterData || globalFilterValue) {
    //   console.log(filterData,globalFilterValue)
    //   let allFilter=''
    //   filterData.forEach(element => {
    //      console.log(element)
    //      allFilter += `&${element.key}=${element.value}`
    //   });
    //   if (globalFilterValue) {
    //      allFilter += `&global=${globalFilterValue}`
    //   }
    //   resp = await axiosInstance.get(
    //     `/product?page=${pageNo}&limit=${limit}&isActive=1${allFilter}`
    //      )
    // }
    // else{
    //   resp = await axiosInstance.get(
    //   `/product?page=${pageNo}&limit=${limit}&isActive=1`
    //   );
    //  }
    resp = await axiosInstance.get(
      `/product?page=${pageNo-1}&limit=${limit}&isActive=1`
      );
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_GET_PRODUCTS_ID=async (id)=>{
  try{
  let resp = await axiosInstance.get(
      `product/${id}`
      );
    return resp.data;
  } catch (err) {
    throw err;
  }
}

const API_GET_CAT=async ()=>{
  try{
    let resp = await axiosInstance.get(
        `category/`
        );
      return resp.data;
    } catch (err) {
      throw err;
    }
}

const API_GET_VARIENT_ID=async (id)=>{
  try{
    let resp = await axiosInstance.get(
        `product/${id}/option`
        );
      return resp.data;
    } catch (err) {
      throw err;
    }
}

const API_ADD_PRODUCT = async (configData,image) => {

  try {
    let {data} = await axiosInstance.post(`/product`, configData);
    const imgUploadUrl = data.src;
    if(imgUploadUrl && image){
      const uploded = await  axios.put(imgUploadUrl,image,{headers:{'Content-Type': 'image/png'}})
    }
    return data;
  } catch (err) {
    throw err;
  }
};

const API_PUT_PRODUCT = async (productId, updatedData,image) => {
  try {
    const {data} = await axiosInstance.put(`/product/${productId}`, updatedData);
    // const imgUploadUrl = await data.src;
    console.log("sdsad",updatedData)
    const imgUploadUrl = await updatedData.src;
    if(imgUploadUrl && typeof image ==='object'){
      var uploded = await  axios.put(imgUploadUrl,image,{headers:{'Content-Type': 'image/png'}})
    }
    return data;
  } catch (err) {
    throw err;
  }
};

const API_DELETE_PRODUCT = async (productID) => {
  try {
    const resp = await axiosInstance.delete(`/product/${productID}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export {
  API_ADD_PRODUCT,
  API_GET_PRODUCTS,
  API_GET_PRODUCTS_ID,
  API_PUT_PRODUCT,
  API_DELETE_PRODUCT,
  API_GET_CAT,
  API_GET_VARIENT_ID,
};

import axiosInstance from "./axios.instance";
import axios from "axios";
// apies calls for products
const API_GET_PRODUCTS = async (pageNo, limit,filterData,globalFilterValue) => {
  try {
    var resp;
    console.log(pageNo, limit,filterData,globalFilterValue)
    if (filterData || globalFilterValue) {
      console.log(pageNo, limit,filterData,globalFilterValue)
      let allFilter=''
       if (filterData) {
        let entries = Object.entries(filterData)
        entries.map( ([key, val]) => {
         allFilter += `&${key}=${val}`
       });
       }
      console.log(pageNo, limit,filterData,globalFilterValue)
      
      if (globalFilterValue) {
         allFilter += `&global=${globalFilterValue}`
         console.log(pageNo, limit,filterData,globalFilterValue)
      
      }
      console.log(allFilter)
   
      resp = await axiosInstance.get(
        `/product?page=${pageNo}&limit=${limit}&isActive=1${allFilter}`
         )

      return resp.data;
    }else{
       resp = await axiosInstance.get(
        `/product?page=${pageNo}&limit=${limit}&isActive=1`
      );  
      return resp.data;
    }
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

const API_Add_VARIENT=async (id,data)=>{
  try{
    let resp = await axiosInstance.post(
        `product/${id}/option`,data
        );
      return resp.data;
    } catch (err) {
      throw err;
    }
}

const API_ADD_PRODUCT = async (configData,image) => {

  try {
    let {data} = await axiosInstance.post(`/product`, configData);
    const imgUploadUrl = data.product.src;
    // console.log(data)
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
    const imgUploadUrl = await updatedData.product.src;
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

const API_GET_PRRODUCTS_WITH_VARIANTS = async () => {
  try {
    const resp = await axiosInstance.get('/product/variants');
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
  API_Add_VARIENT,
  API_GET_PRRODUCTS_WITH_VARIANTS,
};

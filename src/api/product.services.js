import axiosInstance from "./axios.instance";
import axios from "axios";
// apies calls for products
const API_GET_PRODUCTS = async (pageNo, limit,filterData,globalFilterValue) => {
  try {
    var resp;
    if (filterData || globalFilterValue) {
      console.log(filterData,globalFilterValue)
      let allFilter=''
      filterData.forEach(element => {
         console.log(element)
         allFilter += `&${element.key}=${element.value}`
      });
      if (globalFilterValue) {
         allFilter += `&global=${globalFilterValue}`
      }
      resp = await axiosInstance.get(
        `/product?page=${pageNo}&limit=${limit}&isActive=1${allFilter}`
         )
    }
    else{
      resp = await axiosInstance.get(
      `/product?page=${pageNo}&limit=${limit}&isActive=1`
      );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};

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
    const imgUploadUrl = await data.src;
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
  API_PUT_PRODUCT,
  API_DELETE_PRODUCT,
  API_GET_PRRODUCTS_WITH_VARIANTS
};

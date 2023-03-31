import axiosInstance from "./axios.instance";


// api calls for ORDERS
const API_GET_ORDERS = async (pageNo, limit,filterData,globalFilterValue) => {
 
 try{
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
        `/order?page=${pageNo}&limit=${limit}${allFilter}`
         )

      return resp.data;
    }else{
       resp = await axiosInstance.get(
        `/order?page=${pageNo}&limit=${limit}`
      );  
      return resp.data;
    }
  
  } catch (err) {
    throw err;
  }
};

const API_GET_ORDER_DETAILS = async (orderId ) => {
  try {
    const resp = await axiosInstance.get(`/order/${orderId}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_ADD_ORDER = async (data) => {
  try {
    const resp = await axiosInstance.post('/order', data);
    return resp.data;
  } catch (err) {
    throw err;
  }
};


const API_PUT_ORDER = async (orderId, updatedData) => {
  try {
    const resp = await axiosInstance.put(`/order/${orderId}`, updatedData);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export { API_GET_ORDERS, API_PUT_ORDER, API_GET_ORDER_DETAILS, API_ADD_ORDER };

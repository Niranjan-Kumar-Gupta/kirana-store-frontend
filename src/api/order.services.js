import axiosInstance from "./axios.instance";


// api calls for ORDERS
const API_GET_ORDERS = async (pageNo, limit,startDate,endDate,filterData,globalFilterValue) => {
  try{

    var resp;
    if (filterData || globalFilterValue || (startDate && endDate)) {

      let allFilter=''
      if (filterData) {
        filterData.forEach(element => {

          allFilter += `&${element.key}=${element.value}`
       });
      }
      if (globalFilterValue) {
         allFilter += `&global=${globalFilterValue}`
      }
      if (startDate && endDate) {     
          allFilter += `&startDate=${startDate}&endDate=${endDate}&isActive=1`
       }
      resp = await axiosInstance.get(
        `/order?page=${pageNo}&limit=${limit}&isActive=1${allFilter}`
         )

      return resp.data;
    }else{
       resp = await axiosInstance.get(
        `/order?page=${pageNo}&limit=${limit}&isActive=1`
      );  
      return resp.data;
    }
  
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

export { API_GET_ORDERS, API_PUT_ORDER };

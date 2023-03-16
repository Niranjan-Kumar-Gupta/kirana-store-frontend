import axiosInstance from "./axios.instance";

// api calls for enquries
const API_GET_ENQURIES = async (pageNo, limit,startDate,endDate,filterData,globalFilterValue) => {
  console.log(pageNo, limit,startDate,endDate,filterData,globalFilterValue)
  try{
    var resp;
    if (filterData || globalFilterValue || (startDate && endDate)) {
      console.log(filterData,globalFilterValue)
      let allFilter=''
      if (filterData) {
        filterData.forEach(element => {
          console.log(element)
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
        `/enquiry?page=${pageNo}&limit=${limit}&isActive=1${allFilter}`
         )
      console.log(resp)
      return resp.data;
    }else{
       resp = await axiosInstance.get(
        `/enquiry?page=${pageNo}&limit=${limit}&isActive=1`
      );  
      return resp.data;
    }
  
  }catch(err){
    throw err
  }

};

const API_PUT_ENQURY = async (enquiryId, updatedData) => {
  try{
    const resp = await axiosInstance.put(`/enquiry/${enquiryId}`, updatedData);
  return resp.data;
  }catch(err){
    throw err
  }
};

export { API_GET_ENQURIES, API_PUT_ENQURY };

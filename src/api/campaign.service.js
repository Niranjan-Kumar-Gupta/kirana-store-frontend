import axiosInstance from "./axios.instance";

const API_GET_TEMPLATES = async () => {
  try {
    const resp = await axiosInstance.get(`/template?page=0&limit=10`);
    return resp.data.rows;
  } catch (err) {
    throw err;
  }
};

const API_GET_IMAGE_CONFIG = async (config) =>{
    try{
        const resp = await axiosInstance.post(`/image`,config);
        return resp.data;
    }catch(err){
        throw err;
    }
}

const API_ADD_CAMPAIGN = async (campaignData) => {
  try {
    const resp = await axiosInstance.post(`/campaign`, campaignData);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_GET_CAMPAIGNS = async (page,limit,campaignType,startDate,endDate,globalFilterValue) => {
  try{
   
    var resp;
    if ( globalFilterValue || (startDate && endDate)) {
  
      let allFilter=''
      if (globalFilterValue) {
         allFilter += `&global=${globalFilterValue}`
      }
      if (startDate && endDate) {     
          allFilter += `&startDate=${startDate}&endDate=${endDate}&isActive=1`
       }
      resp = await axiosInstance.get(
        `/campaign?page=${page}&limit=${limit}&campaignType=${campaignType}&${allFilter}`
         )
      console.log(resp)
      return resp.data;
    }else{
       resp = await axiosInstance.get(
        `/campaign?page=${page}&limit=${limit}&campaignType=${campaignType}`
      );  
      return resp.data;
    }
    } catch (err) {
      throw err;
    }
};


// const API_GET_CAMPAIGNS = async(page,limit,campaignType ) =>{
//   try {
//     const resp = await axiosInstance.get(`/campaign/?page=${page}&limit=${limit}&campaignType=${campaignType}`)
//     return resp.data;
//   } catch (error) {
//     throw error;
//   }
// }

export {
  API_ADD_CAMPAIGN,
  API_GET_TEMPLATES,
  API_GET_IMAGE_CONFIG,
  API_GET_CAMPAIGNS
}
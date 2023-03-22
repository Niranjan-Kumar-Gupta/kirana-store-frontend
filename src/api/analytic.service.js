import axiosInstance from "./axios.instance";

// api calls for OverAllCount
const API_GET_OVER_ALL_COUNT = async (startDate,endDate) => {
  try {
  if (startDate && endDate) {
    const resp = await axiosInstance.get(
      `/analytics/overall?startDate=${startDate}&endDate=${endDate}`
    );
    return resp.data;
  }else{
    const resp = await axiosInstance.get(
      '/analytics/overall'
    );
    return resp.data;
  }
   
  } catch (err) {
    throw err;
  }
};

export { API_GET_OVER_ALL_COUNT };
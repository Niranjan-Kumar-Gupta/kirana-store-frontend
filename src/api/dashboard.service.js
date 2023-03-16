import axiosInstance from "./axios.instance";

const API_GET_CAMPAIGNS = async (page,limit) => {
    try {
      const resp = await axiosInstance.get(`/campaign?page=${page}&limit=${limit}`);
      return resp.data;
    } catch (err) {
      throw err;
    }
};

const API_GET_CAMPAIGN_DETAILS = async (id) => {
  try {
    const resp = await axiosInstance.get(`/campaign${id}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_GET_CAMPAIGN_CUSTOMERS = async (id,page,limit,status) => {
 if(status&&status!==''){
  try {
    const resp = await axiosInstance.get(`campaign/${id}/customer?page=${page}&limit=${limit}&status=${status}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
 }
  try {
    const resp = await axiosInstance.get(`campaign/${id}/customer?page=${page}&limit=${limit}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};


const API_GET_CAMPAIGN_ANALYTICS = async (id) => {
  try {
    const resp = await axiosInstance.get(`campaign/${id}/analytics`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};


export { API_GET_CAMPAIGNS, API_GET_CAMPAIGN_CUSTOMERS, API_GET_CAMPAIGN_DETAILS, API_GET_CAMPAIGN_ANALYTICS };

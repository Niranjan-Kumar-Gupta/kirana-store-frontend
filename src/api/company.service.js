import axiosInstance from "./axios.instance";

// apies calls for company

const API_GET_COMPANY = async (companyId) => {
  try {
    const resp = await axiosInstance.get(
      `/company/${companyId}`
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
};
const API_ADD_COMPANY = async (configData) => {
  try {
    const resp = await axiosInstance.post(`/company`, configData);
    return resp.data;
  } catch (err) {
    throw err;
  }
};
const API_PUT_COMPANY = async (companyId, updatedData) => {
  try {
    const resp = await axiosInstance.put(
        `/company/${companyId}`,
      updatedData
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_DELETE_COMPANY = async (companyId) => {
  try {
    const resp = await axiosInstance.delete(`/company/${companyId}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export {
  API_ADD_COMPANY,
  API_DELETE_COMPANY,
  API_GET_COMPANY,
  API_PUT_COMPANY,
};

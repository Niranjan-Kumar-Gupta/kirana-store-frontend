import axiosInstance from "./axios.instance";
// import samplePaymentHistory from '../utils/samplePaymentHistory.json'

const API_GET_PAYMENT_HISTORY = async (page, limit) => {
  try {
    const resp = await axiosInstance.get(`/transaction?page=${page}&limit=${limit}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export { API_GET_PAYMENT_HISTORY };


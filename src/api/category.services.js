import axiosInstance from "./axios.instance";

// apies calls for categories

const API_GET_CATEGORIES = async (pageNo, limit,filterData,globalFilterValue) => {
  let resp;
  try {
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
        `/category?page=${pageNo}&limit=${limit}&${allFilter}`
         )
    }
    else{
      resp = await axiosInstance.get(
      `/category?page=${pageNo}&limit=${limit}`
      );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};


const API_ADD_CATEGORY = async (configData) => {
  try {
    const resp = await axiosInstance.post(`/category`, configData);
    return resp.data;
  } catch (err) {
    throw err;
  }
};
const API_PUT_CATEGORY = async (categoryID, updatedData) => {
  try {
    const resp = await axiosInstance.put(
      `/category/${categoryID}`,
      updatedData
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_DELETE_CATEGORY = async (categoryID) => {
  try {
    const resp = await axiosInstance.delete(`/category/${categoryID}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export {
  API_ADD_CATEGORY,
  API_DELETE_CATEGORY,
  API_GET_CATEGORIES,
  API_PUT_CATEGORY,
};
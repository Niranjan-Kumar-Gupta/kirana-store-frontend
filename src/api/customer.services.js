import axiosInstance from "./axios.instance";

// apies calls for customers
const API_GET_CUSTOMERS = async (pageNo, limit,globalFilterValue) => {
  try {
    let resp;
    if (globalFilterValue) {    
     resp = await axiosInstance.get(
      `/customer?page=${pageNo}&limit=${limit}&isActive=1&global=${globalFilterValue}`
    );
    }else{
     resp = await axiosInstance.get(
      `/customer?page=${pageNo}&limit=${limit}&isActive=1`
    );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_CREATE_GROUP = async (data) => {
  try {
    const resp = await axiosInstance.post(`/customer-group`, data);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_ADD_CUSTOMER = async (data, groupId, selectedGroupCustomers) => {
  try {
    const resp = await axiosInstance.post(`/customer`, data);
    const customerId = resp.data.id;

    if (groupId && customerId) {
      const updateGroupWithNewCustomer = {
        customerIds: [...selectedGroupCustomers, customerId],
      };
      await axiosInstance.put(
        `/customer-group/${groupId}`,
        updateGroupWithNewCustomer
      );
    }
    return resp.data;
  } catch (err) {
    throw err;
  }
};
const API_PUT_CUSTOMER = async (customerId, updatedData) => {
  try {
    const resp = await axiosInstance.put(
      `/customer/${customerId}`,
      updatedData
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
};
const API_DELETE_CUSTOMER = async (customerId) => {
  try {
    const resp = await axiosInstance.delete(`/customer/${customerId}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_GET_GROUPS = async (pageNo, limit,globalFilterValue) => {
  try {
    let resp;
    console.log(globalFilterValue)
    if (globalFilterValue) {
      resp = await axiosInstance.get(
        `customer-group?page=${pageNo}&limit=${limit}&global=${globalFilterValue}`
      );
    }else{
     resp = await axiosInstance.get(
      `customer-group?page=${pageNo}&limit=${limit}`
    );
     }
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_GET_GROUP_CUSTOMERS = async (id, pageNo, limit) => {
  try {
    const resp = await axiosInstance.get(
      `customer-group/${id}/customer?page=${pageNo}&limit=${limit}`
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_PUT_GROUP = async (groupId, configData) => {
       try{

        const resp = await axiosInstance.put(`/customer-group/${groupId}`,configData)
        return resp.data;
       }catch(err){
        throw err
       }
}

export {
  API_ADD_CUSTOMER,
  API_DELETE_CUSTOMER,
  API_GET_CUSTOMERS,
  API_PUT_CUSTOMER,
  API_GET_GROUP_CUSTOMERS,
  API_GET_GROUPS,
  API_CREATE_GROUP,
  API_PUT_GROUP
};
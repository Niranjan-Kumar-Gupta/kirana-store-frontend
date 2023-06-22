import axiosInstance from "./axios.instance";

const API_GET_USER_PROFILE = async (id) => {
    try {
        const resp = await axiosInstance.get(`/user/${id}`);
        return resp.data;
    } catch (err) {
        console.log(err)
        throw err
    }
}

const API_ADD_USER = async (data) => {
  console.log(data)
  try {
      const resp = await axiosInstance.post(`/user`,data);
      return resp.data;
  } catch (err) {
      console.log(err)
      throw err
  }
}


const API_GET_OUTLET = async (pageNo, limit,filterData,globalFilterValue) => {
    try {
      var resp;
      if (filterData || globalFilterValue) {
        console.log(filterData,globalFilterValue)
        let allFilter=''
        if (filterData) {
          let entries = Object.entries(filterData)
          entries.map( ([key, val]) => {
           allFilter += `&${key}=${val}`
         });
         }
        if (globalFilterValue) {
           allFilter += `&global=${globalFilterValue}`
        }
        resp = await axiosInstance.get(
          `/outlet?page=${pageNo}&limit=${limit}${allFilter}`
           )
      }
      else{
        resp = await axiosInstance.get(
        `/outlet?page=${pageNo}&limit=${limit}`
        );
       }
      return resp.data;
    } catch (err) {
      throw err;
    }
  };

  
const API_DELETE_USER = async (ID) => {
  try {
    const resp = await axiosInstance.delete(`/user/${ID}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
};

const API_PUT_USER =  async (__data) => {
  try {
    const resp = await axiosInstance.put(`/user/${__data.id}`, __data.data); 
    return resp;
  } catch (err) {
    throw err;
  }
};


const API_GET_USERINOUTLET = async (id) => {
  console.log(id)
    try {
        const resp = await axiosInstance.get(`/outlet/${id}/users`);
        return resp.data;
    } catch (err) {
        console.log(err)
        throw err
    }
}
const API_CHANGE_PASSWORD = async ( configData) =>{
  try {
    const resp = await axiosInstance.put(`/user/resetpassword`,configData);
    return resp
  } catch (error) {
    throw error
  }
}


export { API_GET_USER_PROFILE,API_ADD_USER,API_GET_OUTLET,API_GET_USERINOUTLET,API_DELETE_USER,API_PUT_USER,API_CHANGE_PASSWORD };
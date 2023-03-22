import axiosInstance from "./axios.instance";

const API_SEND_NOTIFICATION = async (message) =>{
    try{
        const resp = await axiosInstance.post('/notification',message)

        return resp;
    }catch(err){
        throw err
    }

}

export default API_SEND_NOTIFICATION;
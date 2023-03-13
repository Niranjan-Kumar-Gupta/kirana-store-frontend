import axiosInstance from "./axios.instance";

const API_LOGIN = async (userCredentials) => {
    try {
        const resp = await axiosInstance.post('/user/login', userCredentials);
        return resp.data;
    } catch (err) {
        console.log(err)
        throw err
    }
}

const API_LOGOUT = async () => {
    try {
        const resp = await axiosInstance.get('/user/logout');
        return resp.data;
    } catch (err) {
        throw err
    }
}

const API_SUBSCRIPTION  = async (companyId) => {
    try {
        const resp = await axiosInstance.get(`/company/${companyId}/conversation`);
        return resp.data;
    } catch (err) {
        throw err
    }
}

const API_GET_OTP  = async (phoneNumber) => {
    try {
        const resp = await axiosInstance.post(`/user/password/otp`,{phone:phoneNumber});
        return resp.data;
    } catch (err) {
        throw err
    }
}

const API_VERIFY_OTP  = async (credential) => {
    try {
        const resp = await axiosInstance.post(`/user/password/otp/verify`,credential);
        return resp.data;
    } catch (err) {
        throw err
    }
}

const API_RESET_PASS  = async (credential) => {
    try {
        const resp = await axiosInstance.post(`/user/password/reset`,credential);
        return resp.data;
    } catch (err) {
        throw err
    } 
}



export { API_LOGIN, API_LOGOUT, API_SUBSCRIPTION,API_GET_OTP,API_VERIFY_OTP,API_RESET_PASS };

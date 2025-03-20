
import { LoginUser } from "../../types";
import axiosInstance from "../../Utils/Https";


const apiRequest = async (endpoint: string, payload: object) => {
    try {
      const response = await axiosInstance.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  export const registerUser = (payload: LoginUser) => 
    apiRequest("api/v1/auth/login", payload);
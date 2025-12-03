import { LoginModel, RegisterModel } from "../types";
import { AxiosPost } from "../utils/axios";

const ENDPOINT = "api/Auth";

export const LoginUser = async (formData : LoginModel): Promise<any> => {
    let result = await AxiosPost(ENDPOINT + `/LoginUser`, formData, false);
    return result.data;
  };

  export const RegisterUser = async (formData : RegisterModel): Promise<any> => {
    let result = await AxiosPost(ENDPOINT + `/RegisterUser`, formData, false);
    return result.data;
  };

  export const LoginWithGoogle = async (idToken: string): Promise<any> => {
    try {
      const response = await AxiosPost(ENDPOINT + `/LoginWithGoogle`, {
        idToken: idToken
      }, false);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Something went wrong" };
    }
  };
  
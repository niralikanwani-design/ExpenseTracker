import { LoginModel, RegisterModel } from "../types";
import { AxiosPost } from "../utils/axios";

const ENDPOINT = "api/Auth";

export const LoginUser = async (formData : LoginModel): Promise<any> => {
    let result = await AxiosPost(ENDPOINT + `/LoginUser`, formData);
    return result.data;
  };

  export const RegisterUser = async (formData : RegisterModel): Promise<any> => {
    let result = await AxiosPost(ENDPOINT + `/RegisterUser`, formData);
    return result.data;
  };
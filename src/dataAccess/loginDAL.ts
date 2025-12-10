import { LoginModel, RegisterModel, UserData } from "../types";
import { AxiosGet, AxiosPost } from "../utils/axios";

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

  export const GetUserData = async (userId : string): Promise<any> => {
    try{
      const response = await AxiosGet(ENDPOINT + `/GetUserData`,{
        userId : userId
      }, false);
      return response.data;
    }catch (error: any){
      throw error.response?.data || { mesage : "Something went wrong" }
    }
  } 

  export const EditUserData = async (formData : UserData): Promise<any> => {
    try{
      const response = await AxiosPost(ENDPOINT + `/EditUserData`,formData, false)
      return response.data;
    }catch (error : any) {
      throw error.response?.data || { mesage : "Something went wrong" }
    }
  }
  
  export const ChangePasswordAPI = async (email : string): Promise<any> => {
    try{
      const response = await AxiosPost(ENDPOINT + `/ChangePassword`,{email}, false);
      return response.data;
    }catch (error: any){
      throw error.response?.data || { mesage : "Something went wrong" }
    }
  } 

  export const SetPassword  = async (email: string, password: string): Promise<any> => {
    try{
      const response = await AxiosPost(ENDPOINT + `/SetPassword`,{ email, password }, false);
      return response.data;
    }catch (error: any){
      throw error.response?.data || { mesage : "Something went wrong" }
    }
  } 
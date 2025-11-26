import { AxiosGet } from "../utils/axios";

const ENDPOINT = "api/Dashboard";

export const GetDashboardData = async (userId : number | string, month : number, type : string): Promise<any> => {
let result = await AxiosGet(ENDPOINT + `/GetDashboardData/${userId}/${month}/${type}`);
    return result.data;
  };
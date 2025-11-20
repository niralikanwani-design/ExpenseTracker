import { AxiosGet } from "../utils/axios";

const ENDPOINT = "api/Dashboard";

export const GetDashboardData = async (userId : number | string, month : number): Promise<any> => {
let result = await AxiosGet(ENDPOINT + `/GetDashboardData/${userId}/${month}`);
    return result.data;
  };
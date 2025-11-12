import { AxiosPost } from "../utils/axios";

const ENDPOINT = "api/Transactions";

export const GetTransactions = async (): Promise<any> => {
  return await AxiosPost(ENDPOINT + `/GetTransaction`, {
    pageNumber: 1,
  pageSize: 10,
  type: "",
  startDate: "2025-10-25",
  endDate: "2025-11-12"
  });
};

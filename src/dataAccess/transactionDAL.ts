import { TransactionFilterPayload } from "../types";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../utils/axios";

const ENDPOINT = "api/Transactions";

export const GetTransactions = async (payload: TransactionFilterPayload): Promise<any> => {
  let result = await AxiosPost(ENDPOINT + `/GetTransaction`, payload);
  return result?.data ?? [];
};

export const GetTransactionById = async (id: number): Promise<any> => {
  let result = await AxiosGet(ENDPOINT + `/GetTransactionById/${id}`);
  return result?.data ?? [];
};

export const AddTransaction = async (payload: any): Promise<any> => {
  let result = await AxiosPost(ENDPOINT + `/AddTransaction`, payload);
  return result.data;
};

export const UpdateTransaction = async (payload: any): Promise<any> => {
  let result = await AxiosPut(ENDPOINT + `/UpdateTransaction`, payload);
  return result.data;
};

export const DeleteTransaction = async (id: number): Promise<any> => {
  let result = await AxiosDelete(ENDPOINT + `/DeleteTransaction/${id}`);
  return result.data;
};

export const GetTotalTransactionsCount = async (): Promise<any> => {
  let result = await AxiosGet(ENDPOINT + `/GetTotalTransactionCount`);
  return result?.data ?? 0;
};

export const GetCategories = async (): Promise<any> => {
  let result = await AxiosGet(ENDPOINT + `/GetCategories`, undefined, false);
  return result?.data ?? [];
};

export const GetAccountType = async (): Promise<any> => {
  let result = await AxiosGet(ENDPOINT + `/GetAccountType`, undefined, false);
  return result?.data ?? [];
}

export const exportCSVApi = async (payload: any) => {
  return await AxiosPost(
    `${ENDPOINT}/ExportCsv`,payload,true,{ responseType: "blob" }
  );
};
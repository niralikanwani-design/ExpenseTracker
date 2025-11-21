import { TransactionFilterPayload } from "../types";
import { AxiosDelete, AxiosPost, AxiosPut } from "../utils/axios";

const ENDPOINT = "api/Transactions";

export const GetTransactions = async (payload: TransactionFilterPayload): Promise<any> => {
  let result = await AxiosPost(ENDPOINT + `/GetTransaction`, payload);
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
  let result = await AxiosDelete(ENDPOINT + `/DeleteTransaction`, id);
  return result.data;
};

import axios from "axios";

export let requests = [];

const AxiosInstance = axios.create({
  baseURL: "https://localhost:7082/",
  responseType: "json",
  timeout: 45000,
});

export const AxiosPost = async (
  url: any,
  payload: any = null,
  needAuth: boolean = true,
  config: any = {}
) => {
  if (needAuth) {
    const authToken = localStorage.getItem("__AUTH_TOKEN__");
    AxiosInstance.defaults.headers["Authorization"] = `Bearer ${authToken}`;
  }

  return await AxiosInstance.post(url, payload, {})
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};

export const AxiosGet = async (
  url: any,
  params?: any,
  needAuth: boolean = true
) => {
  if (needAuth) {
    const authToken = localStorage.getItem("__AUTH_TOKEN__");
    AxiosInstance.defaults.headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (params === null) {
    return await AxiosInstance.get(url)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {});
  } else {
    return await AxiosInstance.get(url, { params: params })
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {});
  }
};

export const AxiosPut = async (
  url: any,
  payload: any = null,
  needAuth: boolean = true
) => {
  if (needAuth) {
    const authToken = localStorage.getItem("__AUTH_TOKEN__");
    AxiosInstance.defaults.headers["Authorization"] = `Bearer ${authToken}`;
  }

  return await AxiosInstance.put(url, payload)
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {});
};

export const AxiosDelete = async (
  url: any,
  payload: any = null,
  needAuth: boolean = true
) => {
  if (needAuth) {
    const authToken = localStorage.getItem("__AUTH_TOKEN__");
    AxiosInstance.defaults.headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (payload === null) {
    return await AxiosInstance.delete(url)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {});
  } else {
    return await AxiosInstance.delete(url, { data: payload })
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {});
  }
};

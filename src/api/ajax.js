import axios from "axios";
import { message } from "antd";
import storageUtils from "../utils/storageUtils";
import { BASE_URL } from "../utils/constant";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// request interceptor
instance.interceptors.request.use(
  (config) => {
    const { token } = storageUtils.getUser();
    if (token) config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
instance.interceptors.response.use(
  (response) => response,
  ({ response }) => {
    // console.log(response)
    const { status } = response;
    if (status === 401) {
      storageUtils.removeUser();
    }
    // return Promise.reject(response)
  }
);

export function ajax(url, data = {}, type = "GET") {
  return new Promise((resolve, _) => {
    let promise;
    if (type === "GET") {
      promise = instance.get(url, {
        params: data,
      });
    } else if (type === "POST") {
      promise = instance.post(url, data);
    } else if (type === "PUT") {
      promise = instance.put(url, data);
    } else {
      promise = instance.delete(url, {
        params: data,
      });
    }
    promise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        message.error("failed" + err.message);
      });
  });
}

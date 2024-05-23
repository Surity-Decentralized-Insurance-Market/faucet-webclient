import axios from "axios";
import { serverUrl } from "../config";

let address: string | null = null;

export let client = createApi();

function createApi() {
  const client = axios.create({
    baseURL: serverUrl,
    timeout: 32000,
    headers: {
      Authorization: address,
      "Content-Type": "application/json",
    },
  });

  // Request Middleware
  client.interceptors.request.use(
    function (config) {
      // Config before Request
      return config;
    },
    function (err) {
      // If Request error
      return Promise.reject(err);
    }
  );

  // Response Middleware
  client.interceptors.response.use(
    function (res) {
      return res;
    },

    function (error) {
      const errMsg = JSON.stringify(
        error?.response?.data?.error ||
          error?.response?.data?.errors?.at(0)?.error ||
          error?.message ||
          error ||
          `"unknown error happened"`
      );

      console.log(error, errMsg);

      return Promise.reject(errMsg.slice(1, -1));
    }
  );

  return client;
}

export function setAddress(addr: string) {
  address = addr;
  client.defaults.headers["Authorization"] = address;
}

export function clearAddress() {
  address = null;
  client.defaults.headers["Authorization"] = null;
}

const api = {
  async request(address: `${string}`) {
    const response = await client.get(`/faucet/request/${address}`);

    const data = response.data;
    return data;
  },

  async getBalance() {
    const response = await client.get<{ balance: number }>(
      `/faucet/balance/${address}`
    );

    const data = response.data;
    return data.balance;
  },

  async getConfiguration() {
    const response = await client.get<{
      defaultTimeout: number;
      tokensPerRequest: number;
    }>(`/faucet/configuration`);

    const data = response.data;
    return data;
  },

  async getWaitTime(address: string) {
    const response = await client.get<{ time: number }>(
      `/faucet/next-request-time/${address}`
    );

    const data = response.data.time - Date.now();
    return data < 0 ? 0 : data;
  },
};

export default api;

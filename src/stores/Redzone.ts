import { defineStore } from "pinia";
import { getRequest, postRequest, putRequest } from "../utils/services/axios";
import { AxiosError } from "axios";
import { Redzone } from "../types/IRedzone";

const RedzoneStore = defineStore('redzone', () => {
  const endpoint = '/redzones'
  async function getAll() {
    try {
      const res = await getRequest(endpoint);
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error((error instanceof AxiosError ? error.response?.data.error : null) || error);
    }
  }

  async function create(redzone: Redzone) {
    try {
      const res = await postRequest(endpoint, redzone);
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error((error instanceof AxiosError ? error.response?.data.error : null) || error);
    }
  }

  async function getOne(redzoneId: string) {
    const url = endpoint + `/${redzoneId}`
    try {
      const res = await getRequest(url);
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error((error instanceof AxiosError ? error.response?.data.error : null) || error);
    }
  }

  async function update(redzone: any) {
    const url = endpoint + `/${redzone.id_redzone}`
    try {
      const res = await putRequest(url, redzone);
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error((error instanceof AxiosError ? error.response?.data.error : null) || error);
    }
  }

  async function getRedzoneDates(redzoneId: string, startDate: string, endDate: string) {
    const url = `/log/redzone/${redzoneId}/dates?startDate=${startDate}&endDate=${endDate}`;
    try {
      const res = await getRequest(url);
      return { data: res.data, error: null };
    } catch (error: unknown) {
      throw new Error((error instanceof AxiosError ? error.response?.data.error : null) || error);
    }
  }

  return {
    getAll,
    create,
    getOne,
    update,
    getRedzoneDates,
  };
});

export default RedzoneStore;

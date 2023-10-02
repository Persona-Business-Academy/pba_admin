import { createStandaloneToast } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import { toastDefaultOptions } from "@/constants/chakra";

const $apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const { toast } = createStandaloneToast();

const handleError = (error: Error | AxiosError) => {
  if (axios.isAxiosError(error) && !!error.response) {
    toast({
      title: error.response.data.message,
      status: "error",
      ...toastDefaultOptions,
    });
    return Promise.reject(error.response.data);
  } else {
    toast({ title: error.message, status: "error", ...toastDefaultOptions });
    return Promise.reject(error);
  }
};

$apiClient.interceptors.request.use(async (config) => {
  if (config.headers) {
    const session = await getSession();
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`; // todo when get token
    }
    config.headers["Content-Type"] = "application/json";
  }
  return config;
}, handleError);

$apiClient.interceptors.response.use((response) => response.data, handleError);

export default $apiClient;

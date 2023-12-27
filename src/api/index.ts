import { createStandaloneToast } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { toastDefaultOptions } from "@/constants/chakra";

const $apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const handleError = (error: Error | AxiosError) => {
  const { toast } = createStandaloneToast({
    defaultOptions: { status: "error", ...toastDefaultOptions },
  });
  if (axios.isAxiosError(error) && !!error.response?.data?.message) {
    toast({ title: error.response.data.message });
    if (error.response.status === 401) {
      signOut();
    }
    return Promise.reject(error.response.data);
  } else {
    toast({ title: error.message });
    return Promise.reject(error);
  }
};

$apiClient.interceptors.request.use(config => {
  if (config.headers) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
}, handleError);

$apiClient.interceptors.response.use(response => response.data, handleError);

export default $apiClient;

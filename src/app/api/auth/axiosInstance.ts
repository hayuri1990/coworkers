import useSessionStore from '@/store/useSessionStore';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const publicAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const authAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

authAxiosInstance.interceptors.request.use(async (config) => {
  const session = useSessionStore.getState();
  const token = session?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { publicAxiosInstance, authAxiosInstance };

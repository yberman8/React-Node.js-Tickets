import axios from 'axios';

let url = import.meta.env.VITE_BASE_URL;

export const axiosConfig = {
   baseURL: url
};

axios.defaults.withCredentials = false;

export const axiosInstance = axios.create(axiosConfig);
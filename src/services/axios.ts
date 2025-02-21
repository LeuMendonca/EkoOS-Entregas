import axios from 'axios'
import { toast } from 'react-toastify';

export const api = axios.create({
    baseURL: 'http://192.168.15.200:8005/api/'
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
      toast.error("Erro na conexão com a API!");
      return Promise.reject(error);
    }
);  
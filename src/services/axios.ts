import axios from 'axios'
import { toast } from 'react-toastify';

export const api = axios.create({
    baseURL: 'http:/ekoos-entregas.ddns.net:8989/api/'
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
      toast.error("Erro na conexão com a API!");
      return Promise.reject(error);
    }
);  
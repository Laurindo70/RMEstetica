import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:3333',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('TokenRm');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.setItem('TokenRm', '');
            localStorage.setItem('NomeRm', '');
            localStorage.setItem('TipoRm', '');
            localStorage.setItem('EstabelecimentoRm', '');
            window.location.href = '/rmestetica/login';
        }
        return Promise.reject(error);
    }
);

export default api;
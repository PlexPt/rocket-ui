import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {ElMessage} from "element-plus";
import router from "../router";

const service: AxiosInstance = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    (config: any) => {
        const headerToken = localStorage.getItem('token');
        if (headerToken) {
            // @ts-ignore
            config.headers['Authorization'] = 'Bearer ' + headerToken
        }

        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: any) => {
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
        }
        // @ts-ignore
        let message = error.response?.data?.message;
        if (message) {
            ElMessage.error(message);
        } else {
            // @ts-ignore
            let msg = error.response?.data?.msg;
            if (msg) {
                ElMessage.error(msg);
            } else {
                ElMessage.error('server error, pls contact admin');
            }
        }

        return Promise.reject();
    }
);

export default service;

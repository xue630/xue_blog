import { message } from "../util/message_util/message_util";
import router from "@/router";
import axios from "axios";

const axios_interceptor = axios.create({
    baseURL:'http://localhost:8080',
    // baseURL:'/api',
    withCredentials: true //生效httpOnlyCoolie
});

//配置响应拦截器
axios_interceptor.interceptors.response.use(
    response=>{
        console.log("响应拦截器生效")
        return response;
    },
    error=>{
            if(error.response.status===401){
            message(error,'登录过期，请重新登录');
            router.push('/login');
            return new Promise(() => {}); // 中断Promise链
        }
        return Promise.reject(error);
    }
)
export default axios_interceptor;
